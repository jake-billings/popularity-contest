import {Candidate} from "../entity/Candidate";

export function applyElo(winner: Candidate, loser: Candidate) {
    const scaler = 400;
    const K = 32;
    const Ka = K;
    const Kb = K;

    const Rai = winner.elo;
    const Rbi = loser.elo;

    const Sa = 1;
    const Sb = 0;

    const Ea = 1 / (1 + Math.pow(10, (Rbi - Rai) / scaler));
    const Eb = 1 / (1 + Math.pow(10, (Rai - Rbi) / scaler));

    const Raa = Rai + Ka * (Sa - Ea);
    const Rba = Rbi + Kb * (Sb - Eb);

    winner.elo = Raa;
    loser.elo = Rba;
}