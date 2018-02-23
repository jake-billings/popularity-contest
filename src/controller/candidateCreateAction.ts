import {Context} from "koa";
import {getManager} from "typeorm";
import {Candidate} from "../entity/Candidate";
import ResponseError from "../error/ResponseError";
import {OK, UNPROCESSABLE_ENTITY} from "http-status-codes";
import {isTimestampValid} from "../lib/UtilTime";
import {verifyPowHash} from "../lib/UtilPow";
import * as validUrl from "valid-url";
import * as request from "request";
import {isImageContentType, isImageUrl} from "../lib/UtilIContentType";

function getContentType(url): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        return request.get(url,
            (err, res) => {
                if (err) return reject(err);
                if (res.statusCode !== OK) return reject();
                return resolve(res.headers['Content-Type']);
            });
    });
}

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

    let isImage = false;
    let contentType;
    try {
        contentType = await getContentType(context.request.body.url);
    } catch (e) {
        throw new ResponseError(
            'Sorry, that page didn\'t load for us.',
            UNPROCESSABLE_ENTITY,
            e
        );
    }
    if (contentType) {
        isImage = isImageContentType(contentType);
    } else {
        isImage = isImageUrl(context.request.body.url);
    }


    const repo = getManager().getRepository(Candidate);

    const newCandidate = repo.create({
        url: context.request.body.url,
        elo: 1200,
        isImage: isImage
    });

    await repo.save(newCandidate);

    context.status = OK;
}