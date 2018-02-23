/**
 * ResponseError
 *
 * REST-safe error object; See ResponseErrorMappings, RouteErrorProne, and properties of this object
 */
import {INTERNAL_SERVER_ERROR} from "http-status-codes";

/**
 * ResponseError
 *
 * Public facing-error message. This is a standard format for error objects that will be sent to end users via http.
 */
export default class ResponseError extends Error {
    /**
     * message
     *
     * string
     *
     * public human-readable error message that will appear in dialogs or toasts
     *
     * Ex: 'Not found'
     */
    public message: string;

    /**
     * status
     *
     * number
     *
     * http status code of this error
     *
     * Ex: 404
     */
    public status: number;

    /**
     * cause
     *
     * any
     *
     * The underlying cause of the error. This may not be displayed to end users. This is where underlying errors
     *  and debugging information can be attached to an error object
     */
    public cause: any;

    /**
     * constructor
     *
     * if message is undefined, it defaults to 'Unknown error'
     * if status is undefined, it defaults to 500
     *
     * @param {string} message
     * @param {number} status
     * @param cause
     */
    constructor(message: string, status: number, cause: any) {
        super();

        this.message = message || 'Unknown error';
        this.status = status || INTERNAL_SERVER_ERROR;
        this.cause = cause;
    }
}