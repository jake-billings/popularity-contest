import * as sha256 from "sha256";

export const DIFFICULTY = 4;

export function verifyHash(str, hash) {
    return sha256(str) == hash;
}

export function verifyPowHash(nonce, str, hash) {
    if (!verifyHash(nonce+str, hash)) return false;
    for (let i = 0; i < DIFFICULTY; i++) {
        if (hash[i] !== '0') return false;
    }
    return true;
}