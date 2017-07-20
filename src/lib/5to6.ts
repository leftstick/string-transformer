import { IncorrectInputError } from '../error';
import { getLineBreak } from '../helper';

export function toTemplateLiteral(str: string): string {
    isES5String(str);

    const QUOTA: string = findQuota(str);
    const LINE_BREAK = getLineBreak(str);
    if (!LINE_BREAK) {
        return convertSingleLine(str, QUOTA);
    }
    return convertMultipleLines(str, QUOTA, LINE_BREAK);
}

function isES5String(str: string): void {
    if (str.startsWith('`') || str.endsWith('`')) {
        throw new IncorrectInputError('not a valid concatenated string, [`] should not around the whole string');
    }
}

function findQuota(str: string): string {
    const firstChar = str.charAt(0);
    if (firstChar === '\'' || firstChar === '"') {
        return firstChar;
    }
    return str.split('').find(c => c === '\'' || c === '"');
}

function convertSingleLine(line: string, quota: string): string {
    const snippets = line.split(/\s*\+\s*/);
    const content = snippets.reduce((p, c) => {
        if (!c.startsWith(quota) && !c.endsWith(quota)) {
            if (c.includes(quota) && !c.includes('\\' + quota)) {
                throw new IncorrectInputError('not a valid concatenated string, [' + quota + '] can not be in variable');
            }
            return p + '${' + c + '}';
        }
        if (c.startsWith(quota) && c.endsWith(quota)) {
            const strContent = c.slice(1, -1);
            if (strContent.includes(quota) && !strContent.includes('\\' + quota)) {
                throw new IncorrectInputError('not a valid concatenated string, [' + quota + '] can not be in plain string');
            }
            return p + strContent;
        }

        throw new IncorrectInputError('not a valid concatenated string');
    }, '');
    return '`' + content + '`';
}

function convertMultipleLines(raw: string, quota: string, lineBreak: string): string {
    const LINE_BREAK_CHARACTERS = lineBreak === '\n' ? '\\n~~~' : '\\r\\n~~~';
    const LINE_BREAK_CHARACTERS_REG = lineBreak === '\n' ? '\\\\n' : '\\\\r\\\\n';

    const rawWithoutBreak = raw
        .split(lineBreak)
        .join(LINE_BREAK_CHARACTERS);

    const snippets = rawWithoutBreak.split(/\s*\+\s*/);

    const content = snippets.reduce((p, c) => {
        const cWithoutbreak = c.replace(new RegExp(LINE_BREAK_CHARACTERS_REG + '~~~'), '');
        if (!cWithoutbreak) {
            return p + cWithoutbreak;
        }
        if (!cWithoutbreak.startsWith(quota) && !cWithoutbreak.endsWith(quota)) {
            if (cWithoutbreak.includes(quota) && !cWithoutbreak.includes('\\' + quota)) {
                throw new IncorrectInputError('not a valid concatenated string, [' + quota + '] can not be in variable');
            }
            return p + (c.startsWith(LINE_BREAK_CHARACTERS) ? LINE_BREAK_CHARACTERS : '') + '${' + cWithoutbreak + '}' + (c.endsWith(LINE_BREAK_CHARACTERS) ? LINE_BREAK_CHARACTERS : '');
        }
        if (cWithoutbreak.startsWith(quota) && cWithoutbreak.endsWith(quota)) {
            const strContent = cWithoutbreak.slice(1, -1);
            if (strContent.includes(quota) && !strContent.includes('\\' + quota)) {
                throw new IncorrectInputError('not a valid concatenated string, [' + quota + '] can not be in plain string');
            }
            return p + (c.startsWith(LINE_BREAK_CHARACTERS) ? LINE_BREAK_CHARACTERS : '') + strContent + (c.endsWith(LINE_BREAK_CHARACTERS) ? LINE_BREAK_CHARACTERS : '');
        }

        throw new IncorrectInputError('not a valid concatenated string');
    }, '');

    const newContent = content
        .replace(new RegExp('\\$\\{\\}', 'g'), '')
        .replace(new RegExp(LINE_BREAK_CHARACTERS_REG + '~~~', 'g'), '')
        .replace(new RegExp(LINE_BREAK_CHARACTERS_REG, 'g'), '\n');

    return '`' + newContent + '`';
}


function getVariableReplacer(quota: string): (substring: string, ...args: any[]) => string {
    return function (match, offset) {
        return quota + ' + ' + match.slice(2, -1) + ' + ' + quota;
    };
}
