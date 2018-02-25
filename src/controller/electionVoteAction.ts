import {Context} from "koa";
import {getManager} from "typeorm";
import {Candidate} from "../entity/Candidate";
import ResponseError from "../error/ResponseError";
import {ACCEPTED, NOT_FOUND, UNPROCESSABLE_ENTITY} from "http-status-codes";
import {isTimestampValid} from "../lib/UtilTime";
import {verifyPowHash} from "../lib/UtilPow";
import * as validUrl from "valid-url";
import {Election} from "../entity/Election";
import {applyElo} from "../lib/UtilElo";

/**
 * electionVoteAction()
 *
 * POST /vote
 *
 * vote in an election created by the POST /election route
 *
 * no proof-of-work is required by this route because proof-of-work is required to create the election object.
 *  Once a vote is received on an election object, the election object is deleted and additional attempts to
 *  vote on it will fail. this prevents spam on this route, so no PoW is required.
 *
 * Steps
 *  1. Validate datatypes
 *  2. query the election
 *  3. apply the user's vote to the target candidates
 *  4. save the changes to elo rankings
 *  5. delete the election object to prevent double voting
 *
 *
 * @param {Application.Context} context
 * @returns {Promise<void>}
 */
export async function electionVoteAction(context: Context) {
    if (typeof context.request.body._id !== 'string') throw new ResponseError(
        'missing string field \'_id\' from request',
        UNPROCESSABLE_ENTITY,
        context.request.body._id
    );
    if (typeof context.request.body.voteForA !== 'boolean') throw new ResponseError(
        'missing boolean field \'voteForA\' from request',
        UNPROCESSABLE_ENTITY,
        context.request.body.voteForA
    );

    const electionRepo = getManager().getRepository(Election);

    const election = await electionRepo.findOneById(context.request.body._id, {relations: ['a', 'b']});

    if (!election) throw new ResponseError(
        'could not find election with provided _id',
        NOT_FOUND,
        context.request.body._id
    );


    let a = election.a;
    let b = election.b;

    if (context.request.body.voteForA) {
        applyElo(a, b);
    } else {
        applyElo(b, a);
    }

    const candidateRepo = getManager().getRepository(Candidate);

    await candidateRepo.save(a);
    await candidateRepo.save(b);

    await electionRepo.deleteById(context.request.body._id);

    context.status = ACCEPTED;
}