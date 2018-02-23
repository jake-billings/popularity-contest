import {candidateCreateAction} from "./controller/candidateCreateAction";
import {difficultyReadAction} from "./controller/difficultyReadAction";
import {electionCreateAction} from "./controller/electionCreateAction";
import {electionVoteAction} from "./controller/electionVoteAction";
import {candidateReadRandomAction} from "./controller/candidateReadRandomAction";
import {candidateCountAction} from "./controller/candidateCountAction";
import {candidateReadAction} from "./controller/candidateReadAction";

export const AppRoutes = [
    {
        path: '/submit',
        method: 'post',
        action: candidateCreateAction
    },{
        path: '/vote',
        method: 'post',
        action: electionVoteAction
    },{
        path: '/election',
        method: 'post',
        action: electionCreateAction
    },{
        path: '/difficulty',
        method: 'get',
        action: difficultyReadAction
    },{
        path: '/random',
        method: 'get',
        action: candidateReadRandomAction
    }, {
        path: '/count',
        method: 'get',
        action: candidateCountAction
    },{
        path: '/candidates',
        method: 'get',
        action: candidateReadAction
    }
];