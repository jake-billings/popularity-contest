export function getUnixTime(): number {
    return Math.floor(new Date().getTime() / 1000);
}

export function isTimestampValid(time: number): boolean {
    return Math.abs(getUnixTime() - time) < 10000;
}