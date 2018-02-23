import {Context} from "koa";
import {getManager} from "typeorm";
import {Candidate} from "../entity/Candidate";
import ResponseError from "../error/ResponseError";
import {UNPROCESSABLE_ENTITY} from "http-status-codes";
import {isTimestampValid} from "../lib/UtilTime";
import {verifyPowHash} from "../lib/UtilPow";
import * as validUrl from "valid-url";


export async function candidateCreateAction(context: Context) {
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
    if (typeof context.request.body.url !== 'string') throw new ResponseError(
        'missing string field \'url\' from request',
        UNPROCESSABLE_ENTITY,
        context.request.body.url
    );
    if (typeof context.request.body.hash !== 'string') throw new ResponseError(
        'missing string field \'hash\' from request',
        UNPROCESSABLE_ENTITY,
        context.request.body.hash
    );

    if (!verifyPowHash(context.request.body.nonce, context.request.body.time.toString() + context.request.body.url, context.request.body.hash)) throw new ResponseError(
        'your proof of work hash doesn\'t look valid. did you do enough work?',
        UNPROCESSABLE_ENTITY,
        context.request.body.hash
    );

    if (!validUrl.isWebUri(context.request.body.url)) throw new ResponseError(
        'string field \'url\' from request must be a valid web url',
        UNPROCESSABLE_ENTITY,
        context.request.body.url
    );

    //todo verify 200 status
    //todo use content-type to check if image



    const repo = getManager().getRepository(Candidate);

    const newCandidate = repo.create({
        url: context.request.body.url,

        elo: 1200,
        isImage: false
    });

    await repo.save(newCandidate);

    context.status = 201;
}