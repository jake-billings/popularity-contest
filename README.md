# popularity-contest
Popularity contest is a side-project I completed to learn about blockchain-like proof-of-work algorithms and the TypeORM, KOA, Angular, NodeJS technology stack.

The goal of the application is to allow users to find the best page on the internet. Users can submit the page they are on to a central repository, then other users can view an vote on submissions.

Submissions are ranked using the Elo system, which is primarily used to rank chess players.

Since I want to allow anonymous users to submit data and vote on submissions, I implement multiple anti-spam measures.

Submissions that add to or modify the database require blockchain-like proof-of work calculations. I use an algorithm similar to scrypt proof-of-work but much simpler.

Each submission that modifies the database muse include a current timestamp and nonce that both sha256 hash with the data submitted to lead with a variable number 0's.

Example endpoints that use PoW validation are `electionCreateAction` and `candidateCreateAction`. `UtilPow.ts` contains the code that validates PoW on the server side.

Mining is performed by the frontend library in `popularity-contest.js` in `src/frontend`. See the function `_mine()`.

Very little effort has been placed into design/user experience. This repository has mainly been an experiment into technology.

## Structure
- Chrome extension: The chrome extension in `/chrome` exists as an experiment into building chrome extensions. It allows users to submit content to the central repository as they browse.
- Server: The server in `/src` serves the API backend and the angular frontend use to vote on content.

## How to Develop the Chrome Extension

1. Clone this repository
1. cd `chrome`
1. run `yarn install`
2. Click the three dot menu in the upper right
3. Navigate to More Tools > Extensions
4. Check Developer Mode
5. Click Load Unpacked Extension
6. Navigate to the `chrome` directory in this repository

The spider menu now appears in the upper right and as a contextual menu when right-clicking images and links.

## How to Develop the Frontend/Backend

Install MySql
1. Use the MySql website
1. Open the MySql console by running `mysql`
1. Create the database using `create database popularitycontest;`
1. Copy the example db config `cp ormconfig.example.json ormconfig.json`
1. Edit the `ormconfig.json` to include your db credentials

Install TypeScript and Yarn with
1. `npm i -g yarn`
2. `npm i -g typescript`

Setup this project

1. Clone this repository
1. Run `yarn install`
1. `cd src/frontend`
1. Run `yarn install` again
1. `cd ../..`
1. Run `tsc`
1. Run `yarn start`