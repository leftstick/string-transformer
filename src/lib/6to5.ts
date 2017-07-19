import { IncorrectInputError } from '../error';
import { getLineBreak } from '../helper';

export function toConcatenatedStrings(literal: string, quota: string): string {
    isTemplateLiteral(literal);

    const LINE_BREAK = getLineBreak(literal);
    if (!LINE_BREAK) {
        return convertSingleLine(literal, quota);
    }
    return convertMultipleLines(literal, quota, LINE_BREAK);
}

function isTemplateLiteral(literal: string): void {
    if (!literal || literal.length < 3 || literal.charAt(0) !== literal.charAt(literal.length - 1) || literal.charAt(0) !== '`') {
        throw new IncorrectInputError('Not a valid literal');
    }
}

function convertSingleLine(line: string, quota: string): string {
    const newLine = line
        .replace(new RegExp(quota, 'g'), getQuotaReplacer(quota))
        .replace(/\$\{.+?\}/g, getVariableReplacer(quota))
        .replace(/`/g, quota);
    return newLine.endsWith(' + \'\'') ? newLine.slice(0, -5) : newLine;
}

function convertMultipleLines(raw: string, quota: string, lineBreak: string): string {
    const LINE_BREAK_CHARACTERS = lineBreak === '\n' ? '\\n' : '\\r\\n';
    return raw
        .split(lineBreak)
        .join(LINE_BREAK_CHARACTERS)
        .replace(new RegExp(quota, 'g'), getQuotaReplacer(quota))
        .replace(/\$\{.+?\}/g, getVariableReplacer(quota))
        .replace(/`/g, quota)
        .replace(new RegExp('\\s\\+\\s' + quota + quota + '$'), '');
}


function getQuotaReplacer(quota: string): (substring: string, ...args: any[]) => string {
    return function (match, offset, line) {
        return (line.charAt(offset - 1) === '\\' ? '\\\\' : '\\') + quota;
    };
}

function getVariableReplacer(quota: string): (substring: string, ...args: any[]) => string {
    return function (match, offset) {
        return quota + ' + ' + match.slice(2, -1) + ' + ' + quota;
    };
}
