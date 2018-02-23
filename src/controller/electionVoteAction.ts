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