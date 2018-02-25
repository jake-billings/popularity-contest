import * as sha256 from "sha256";

/**
 * DIFFICULTY
 *
 * the required difficulty a hash must demonstrated to be considered of sufficient work
 *
 * the hash string must lead with this many zeros to be considered valid
 *
 * @type {number}
 */
export const DIFFICULTY = 4;

/**
 * verifyHash()
 *
 * returns true if sha256(str) is hash
 *
 * @param str string to check
 * @param hash hash to check
 * @returns {boolean} sha256(str) == hash
 */
export function verifyHash(str, hash) {
    return sha256(str) == hash;
}

/**
 * verifyPowHash()
 *
 * returns true if hash is an actual hash of nonce+str AND leads with DIFFICULTY 0's
 *
 * this verifies that the client had to "work hard" to find a nonce that hashed with str to lead with
 *  enough 0's
 *
 * used in candidateCreateAction to prevent spam submitting links and electionCreateAction to prevent
 *  spam in voting
 *
 * see frontend library for function _mine() that "works hard" to find valid nonces
 *
 * @param nonce the nonce used to generate the proof of work hash
 * @param str the string data that work had to be generated for
 * @param hash sha256(nonce+str); must lead with DIFFICULTY number of 0's
 * @returns {boolean} true if the hash is valid and leads with enough 0's
 */
export function verifyPowHash(nonce, str, hash) {
    if (!verifyHash(nonce+str, hash)) return false;
    for (let i = 0; i < DIFFICULTY; i++) {
        if (hash[i] !== '0') return false;
    }
    return true;
}