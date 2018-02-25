import {Context} from "koa";
import {getManager} from "typeorm";
import {Candidate} from "../entity/Candidate";

/**
 * GET /candidates
 *
 * returns the top 30 links sorted by elo ranking as an array
 *
 * This is a simple GET, so no PoW is required.
 *
 * @param {Application.Context} context
 * @returns {Promise<void>}
 */
export async function candidateReadAction(context: Context) {
    const candidateRepo = getManager().getRepository(Candidate);

    context.body = await candidateRepo.createQueryBuilder('candidate')
        .select('candidate')
        .orderBy('candidate.elo', 'DESC')
        .limit(30)
        .getMany();
}