import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Candidate} from "./Candidate";

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