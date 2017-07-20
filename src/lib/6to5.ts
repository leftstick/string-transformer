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
    if (!literal || literal.length < 2 || literal.charAt(0) !== literal.charAt(literal.length - 1) || literal.charAt(0) !== '`') {
        throw new IncorrectInputError('Not a valid literal');
    }
    const content = literal.slice(1, -1);
    if (content.includes('`') && !content.includes('\\`')) {
        throw new IncorrectInputError('Not a valid literal, contains invalid [`]');
    }
}

function convertSingleLine(line: string, quota: string): string {
    const content = line.slice(1, -1);
    const newContent = content
        .replace(new RegExp(quota, 'g'), getQuotaReplacer(quota))
        .replace(/\$\{.+?\}/g, getVariableReplacer(quota))
        .replace(/\\\|~~~\|/g, quota);

    const newLine = `${quota}${newContent}${quota}`;

    return newLine.replace(new RegExp('^' + quota + quota + '\\s\\+\\s'), '')
        .replace(new RegExp('\\s\\+\\s' + quota + quota + '$'), '');
}

function convertMultipleLines(raw: string, quota: string, lineBreak: string): string {
    const LINE_BREAK_CHARACTERS = lineBreak === '\n' ? '\\n' : '\\r\\n';
    const LINE_BREAK_CHARACTERS_REG = lineBreak === '\n' ? '\\\\n' : '\\\\r\\\\n';
    const content = raw
        .split(lineBreak)
        .join(LINE_BREAK_CHARACTERS)
        .slice(1, -1);
    const newContent = content.replace(new RegExp(quota, 'g'), getQuotaReplacer(quota))
        .replace(/\$\{.+?\}/g, getVariableReplacer(quota));

    const newLine = `${quota}${newContent}${quota}`;

    return newLine.replace(new RegExp('^' + quota + quota + '\\s\\+\\s'), '')
        .replace(new RegExp('\\s\\+\\s' + quota + quota + '$'), '')
        .replace(new RegExp(LINE_BREAK_CHARACTERS_REG, 'g'), LINE_BREAK_CHARACTERS + '\' +' + lineBreak + '\'');
}


function getQuotaReplacer(quota: string): (substring: string, ...args: any[]) => string {
    return function (match, offset, line) {
        return (line.charAt(offset - 1) === '\\' ? '\\\\' : '\\') + quota;
    };
}

function getVariableReplacer(quota: string): (substring: string, ...args: any[]) => string {
    return function (match, offset) {
        return quota + ' + ' + match.slice(2, -1).replace(new RegExp(quota, 'g'), '|~~~|') + ' + ' + quota;
    };
}
