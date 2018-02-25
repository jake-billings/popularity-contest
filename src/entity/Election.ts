import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Candidate} from "./Candidate";

/**
 * Election
 *
 * An election is a vote between two candidates. The winner and loser have their elo scores adjusted in electionVoteAction
 *  by the logic implemented in UtilElo.ts
 *
 * Elections are created and stored by the server to ensure that the server picks what elections occur. This ensures
 *  that proper random elo matching occurs. Without this, clients could just pick what votes they make. As a result,
 *  they could artificially inflate scores much more easily.
 *
 * This class forces clients to vote in only server-approved elections that are generated randomly.
 *
 * The object is deleted after an election occurs to ensure duplicate votes aren't made.
 */
@Entity()
export class Election {

    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;

    @ManyToOne(type => Candidate)
    a: Candidate;

    @ManyToOne(type => Candidate)
    b: Candidate;
}