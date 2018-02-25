import {Context} from "koa";
import {getManager} from "typeorm";
import {Candidate} from "../entity/Candidate";
import ResponseError from "../error/ResponseError";
import {UNPROCESSABLE_ENTITY} from "http-status-codes";
import {isTimestampValid} from "../lib/UtilTime";
import {verifyPowHash} from "../lib/UtilPow";
import * as validUrl from "valid-url";
import {Election} from "../entity/Election";


/**
 * electionCreateAction()
 *
 * POST /election
 *
 * creates an election
 *  - an election is an opportunity to vote between two random candidates from the database
 *  - the object is created as a backend database object to force frontend users to vote in
 *    the random order determined by the server. without this database object, users could
 *    vote on whatever candidates they choose; elections should occur between random candidates
 *    for proper elo rankings
 *
 * Steps:
 *  1. validate timestamp as part of proof of work validation
 *  2. validate nonce and hash data types
 *  3. validate proof of work hash to prevent spam
 *  4. create an election object with two random candidates from the database
 *  5. return the election to the user and store it in the database
 *
 * @param {Application.Context} context
 * @returns {Promise<void>}
 */
export async function electionCreateAction(context: Context) {
    //Validate timestamp
    if (typeof context.request.body.time !== 'number') throw new ResponseError(
        'missing numeric field \'time\' from request',
        UNPROCESSABLE_ENTITY,
        context.request.body.time
    );
    if (!isTimestampValid(context.request.body.time)) throw new ResponseError(
        'timestamp from field \'time\' must be unix time within 10s of now',
        UNPROCESSABLE_ENTITY,
        context.request.body.time
    );

    if (typeof context.request.body.nonce !== 'string') throw new ResponseError(
        'missing string field \'nonce\' from request',
        UNPROCESSABLE_ENTITY,
        context.request.body.nonce
    );
    if (typeof context.request.body.hash !== 'string') throw new ResponseError(
        'missing string field \'hash\' from request',
        UNPROCESSABLE_ENTITY,
        context.request.body.hash
    );
    if (!verifyPowHash(context.request.body.nonce, context.request.body.time.toString(), context.request.body.hash)) throw new ResponseError(
        'your proof of work hash doesn\'t look valid. did you do enough work?',
        UNPROCESSABLE_ENTITY,
        context.request.body.hash
    );

    const candidateRepo = getManager().getRepository(Candidate);
    const electionRepo = getManager().getRepository(Election);

    const candidates = await candidateRepo.createQueryBuilder('candidate')
        .select('candidate')
        .where('candidate.isImage = true')
        .orderBy('RAND()', 'DESC')
        .limit(2)
        .getMany();

    const election = electionRepo.create({
        a: candidates[0],
        b: candidates[1]
    });

    await electionRepo.save(election);

    context.status = 201;
    context.body = election;
}