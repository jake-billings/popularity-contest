import ResponseError from "./ResponseError";
import {BAD_REQUEST, FORBIDDEN, NOT_FOUND, UNAUTHORIZED, UNPROCESSABLE_ENTITY} from "http-status-codes";

/**
 * logError()
 *
 * logs a ResponseError object to the console
 *
 * @param {ResponseError} e
 */
function logError(e: ResponseError) {
    console.error(e.status, e.message, e.cause);
}

/**
 * convertErrorToResponseError()
 *
 * called by the catch block in koaAction to convert any error thrown by the action function, which
 *  was implemented by a subclass to a ResponseError object, which we are comfortable returning to
 *  the end user via REST
 *
 * @param e the error caught by the catch block
 * @returns {ResponseError} a response error we are comfortable sending to end users
 */
function convertErrorToResponseError(e): ResponseError {
    const resultFromTypeOrmMappings = convertUnknownErrorToResponseError(e);
    if (resultFromTypeOrmMappings) return resultFromTypeOrmMappings;
    if (e.message && e.status) return e;
    return new ResponseError(e.message, e.status, e);
}

/**
 * convertUnknownErrorToResponseError()
 *
 * identify common db and low-level errors then convert them to human-readable formate
 *
 * @param e
 * @returns {ResponseError}
 */
function convertUnknownErrorToResponseError(e): ResponseError {
    if (e.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        const fieldName = e.sqlMessage.split('\'')[1];
        return new ResponseError(`Your submission is missing the required field \'${fieldName}\'.`, UNPROCESSABLE_ENTITY, e);
    }
    if (e.code === 'ER_DUP_ENTRY') {
        const fieldName = e.sqlMessage.split('\'')[1];
        return new ResponseError(`Your submission would create a duplicate in the database.`, UNPROCESSABLE_ENTITY, e);
    }
    if (e.message === 'jwt malformed') {
        return new ResponseError('Malformed JWT in request Authorization header.', BAD_REQUEST, e);
    }
    return null;
}

/**
 * canIgnore()
 *
 * We don't need to log all errors to the console; especially since status codes are printed by logger anyway.
 *  This function ignores unimportant errors (see implementation for which ones)
 *
 * @param {ResponseError} err
 */
function canIgnore(err: ResponseError) {
    if (err.status === UNAUTHORIZED) return true;
    if (err.status === FORBIDDEN) return true;
    if (err.status === UNPROCESSABLE_ENTITY) return true;
    if (err.status === NOT_FOUND) return true;
    return false;
}

/**
 * errorFormatterMiddleware()
 *
 * catches formats errors properly using our ResponseErrorObject
 *
 * @param ctx
 * @param {Function} next
 */
export default async function errorFormatterMiddleware(ctx, next: Function) {
    try {
        await next();
    } catch (e) {
        const err = convertErrorToResponseError(e);
        if (!canIgnore(err)) console.error(err);
        ctx.body = {
            status: err.status,
            message: err.message
        };
        ctx.status = err.status;
    }
}