import {Context} from "koa";
import {DIFFICULTY} from "../lib/UtilPow";

export async function difficultyReadAction(ctx: Context) {
    ctx.body = DIFFICULTY;
}