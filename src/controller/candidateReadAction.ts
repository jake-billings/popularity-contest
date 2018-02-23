import {Context} from "koa";
import {getManager} from "typeorm";
import {Candidate} from "../entity/Candidate";

export async function candidateReadAction(context: Context) {
    const candidateRepo = getManager().getRepository(Candidate);

    context.body = await candidateRepo.createQueryBuilder('candidate')
        .select('candidate')
        .orderBy('candidate.elo', 'DESC')
        .limit(30)
        .getMany();
}