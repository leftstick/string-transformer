import { IncorrectInputError } from '../error';
import { getLineBreak } from '../helper';

export function toTemplateLiteral(str: string): string {
    isES5String(str);

    const QUOTA: string = str.charAt(0);
    const LINE_BREAK = getLineBreak(str);
    if (!LINE_BREAK) {
        return convertSingleLine(str, QUOTA);
    }
    return convertMultipleLines(str, QUOTA, LINE_BREAK);
}

function isES5String(str: string): void {
    if (!str || str.length < 2 || str.charAt(0) !== str.charAt(str.length - 1) || (str.charAt(0) !== '\'' && str.charAt(0) !== '"')) {
        throw new IncorrectInputError('Not a valid string');
    }
}

function convertSingleLine(line: string, quota: string): string {
    const newLine = line
        .replace(new RegExp('\\\\' + quota, 'g'), quota)
        .replace(/^.+?\s*\+\s*/, getVariableReplacer(quota))
        .replace(/`/g, quota);
    return newLine.endsWith(' + \'\'') ? newLine.slice(0, -5) : newLine;
}

function convertMultipleLines(raw: string, quota: string, lineBreak: string): string {
    const LINE_BREAK_CHARACTERS = lineBreak === '\n' ? '\\n' : '\\r\\n';
    return raw
        .split(lineBreak)
        .join(LINE_BREAK_CHARACTERS)
        .replace(new RegExp('\\\\' + quota, 'g'), quota)
        .replace(/\$\{.+?\}/g, getVariableReplacer(quota))
        .replace(/`/g, quota)
        .replace(new RegExp('\\s\\+\\s' + quota + quota + '$'), '');
}


function getVariableReplacer(quota: string): (substring: string, ...args: any[]) => string {
    return function (match, offset) {
        return quota + ' + ' + match.slice(2, -1) + ' + ' + quota;
    };
}
