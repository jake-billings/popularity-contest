import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';
import {Election} from "./Election";

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