export function isImageContentType(a: string) {
    if (a === 'image/gif') return true;
    if (a === 'image/jpeg') return true;
    if (a === 'image/png') return true;
    return false;
}

export function isImageUrl(a: string) {
    if (a.indexOf('.gif') > -1) return true;
    if (a.indexOf('.jpg') > -1) return true;
    if (a.indexOf('.jpeg') > -1) return true;
    if (a.indexOf('.png') > -1) return true;
    return false;
}