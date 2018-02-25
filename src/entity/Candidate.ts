import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';
import {Election} from "./Election";


/**
 * Candidate
 *
 * Entity class
 *
 * A candidate is a submission to the database. It represents one link. This link is treated differently if it is an
 *  image vs if it is to an html page.
 *
 * The create controller should validate that the URL is valid and resolves to a page or image. It should also determine if
 *  the entity is an image.
 *
 * Candidates are ranked using an ELO system. Users are presented with two candidates and pick a winner. See electionVoteAction
 *  and UtilElo.
 *
 * Elections exist as database objects in order to ensure that the server picks the order in which clients vote.
 */
@Entity()
export class Candidate {

    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column({
        unique: true
    })
    url: string;

    @Column()
    elo: number;

    @Column()
    isImage: boolean;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;
}