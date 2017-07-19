

export function getLineBreak(str: string): string {
    if (str.indexOf('\r\n') > -1) {
        return '\r\n';
    }
    if (str.indexOf('\n') > -1) {
        return '\n';
    }
    return '';
}
