import {Candidate} from "../entity/Candidate";

/**
 * applyElo()
 *
 * Have you seen The Social Network? This is the algorithm they write on Mark Zuckerberg's window at Harvard.
 *
 * It is an implementation of the Elo system used to rank chess players. It attempts to make accurate predictions
 *  about future matches based on past matches. Read the Wikipedia page for more information.
 *
 * This implementation MUTATES the arguments winner and loser with adjusted elo scores based on match results.
 *
 * @param {Candidate} winner mutable winner candidate object to have its rank increased
 * @param {Candidate} loser mutable loser candidate object to have its rank decreased
 */
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