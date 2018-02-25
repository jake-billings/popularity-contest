import {Context} from "koa";
import {getManager} from "typeorm";
import {Candidate} from "../entity/Candidate";

/**
 * GET /count
 *
 * returns the number of candidates (links) submitted to the database as a number
 *
 * This is a simple GET, so no PoW is required.
 *
 * @param {Application.Context} context
 * @returns {Promise<void>}
 */
export async function candidateCountAction(context: Context) {
    const candidateRepo = getManager().getRepository(Candidate);

    context.body = await candidateRepo.createQueryBuilder('candidate')
        .select('candidate')
        .getCount();
}