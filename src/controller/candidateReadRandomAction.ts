import {Context} from "koa";
import {getManager} from "typeorm";
import {Candidate} from "../entity/Candidate";

/**
 * READ /random
 *
 * returns a single random database entry/link
 *
 * use with cation; this could be anything
 *
 * @param {Application.Context} context
 * @returns {Promise<void>}
 */
export async function candidateReadRandomAction(context: Context) {
    const candidateRepo = getManager().getRepository(Candidate);

    context.body = await candidateRepo.createQueryBuilder('candidate')
        .select('candidate')
        .orderBy('RAND()', 'DESC')
        .limit(1)
        .getOne();
}