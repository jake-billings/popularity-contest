import {Context} from "koa";
import {getManager} from "typeorm";
import {Candidate} from "../entity/Candidate";
import ResponseError from "../error/ResponseError";
import {UNPROCESSABLE_ENTITY} from "http-status-codes";
import {isTimestampValid} from "../lib/UtilTime";
import {verifyPowHash} from "../lib/UtilPow";
import * as validUrl from "valid-url";
import {Election} from "../entity/Election";


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