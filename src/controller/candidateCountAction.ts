import {Context} from "koa";
import {getManager} from "typeorm";
import {Candidate} from "../entity/Candidate";

export async function candidateCountAction(context: Context) {
    const candidateRepo = getManager().getRepository(Candidate);

    context.body = await candidateRepo.createQueryBuilder('candidate')
        .select('candidate')
        .getCount();
}