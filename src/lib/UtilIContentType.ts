/**
 * isImageContentType()
 *
 * returns true if a is a simple image content type
 *
 * @param {string} a string to test
 * @returns {boolean} true if a is an image content type; false if it isn't
 */
export function isImageContentType(a: string) {
    if (a === 'image/gif') return true;
    if (a === 'image/jpeg') return true;
    if (a === 'image/png') return true;
    return false;
}

/**
 * isImageUrl()
 *
 * called on url if it doesn't return a content type header
 *
 * returns true if the file extension is a simple image type
 *
 * @param {string} a url to test
 * @returns {boolean} true if the url contains an image file extension; false if it doesn't
 */
export function isImageUrl(a: string) {
    if (a.indexOf('.gif') > -1) return true;
    if (a.indexOf('.jpg') > -1) return true;
    if (a.indexOf('.jpeg') > -1) return true;
    if (a.indexOf('.png') > -1) return true;
    return false;
}