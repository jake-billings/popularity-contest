import {Context} from "koa";
import {DIFFICULTY} from "../lib/UtilPow";

/**
 * difficultyReadAction()
 *
 * GET /difficulty
 *
 * This is a simple GET, so no PoW is required.
 *
 * returns the current difficulty required for proof-of-work operations;
 *  this is the number of leading 0's required in a hash for it to be considered a valid
 *  proof of work by UtilPow
 *
 * See Util PoW
 *
 * @param {Application.Context} ctx
 * @returns {Promise<void>}
 */
export async function difficultyReadAction(ctx: Context) {
    ctx.body = DIFFICULTY;
}