import * as should from 'should';
import { toConcatenatedStrings } from '../src';

describe('transform', function () {
    describe('single line', function () {
        it('single quota: without quota in it', function () {

            const es6string = '`test1`';
            const result = toConcatenatedStrings(es6string, '\'');

            should(result).be.exactly('\'test1\'');
        });

        it('single quota: with single quota in it', function () {

            const es6string = '`te\'st1`';
            const result = toConcatenatedStrings(es6string, '\'');

            should(result).be.exactly('\'te\\\'st1\'');
        });

        it('single quota: with ESC & single quota in it', function () {

            const es6string = '`te\\\'st1`';
            const result = toConcatenatedStrings(es6string, '\'');

            should(result).be.exactly('\'te\\\\\\\'st1\'');
        });

        it('single quota: with double quota in it', function () {

            const es6string = '`te"st1`';
            const result = toConcatenatedStrings(es6string, '\'');

            should(result).be.exactly('\'te"st1\'');
        });

        it('single quota: with variable in it', function () {

            const es6string = '`test1${name}to`';
            const result = toConcatenatedStrings(es6string, '\'');

            should(result).be.exactly('\'test1\' + name + \'to\'');
        });

        it('single quota: with multiple variables in it', function () {

            const es6string = '`test1${name}to${age}`';
            const result = toConcatenatedStrings(es6string, '\'');

            should(result).be.exactly('\'test1\' + name + \'to\' + age');
        });

        it('double quota: without quota in it', function () {

            const es6string = '`test1`';
            const result = toConcatenatedStrings(es6string, '"');

            should(result).be.exactly('"test1"');
        });

        it('double quota: with double quota in it', function () {

            const es6string = '`te"st1`';
            const result = toConcatenatedStrings(es6string, '"');

            should(result).be.exactly('"te\\\"st1"');
        });

        it('double quota: with ESC & double quota in it', function () {

            const es6string = '`te\\"st1`';
            const result = toConcatenatedStrings(es6string, '"');

            should(result).be.exactly('"te\\\\\\\"st1"');
        });

        it('double quota: with single quota in it', function () {

            const es6string = '`te\'st1`';
            const result = toConcatenatedStrings(es6string, '"');

            should(result).be.exactly('"te\'st1"');
        });
    });

    describe('multiple lines', function () {
        it('single quota: without quota in it', function () {

            const es6string = `\`test
            abc\``;
            const result = toConcatenatedStrings(es6string, '\'');

            should(result).be.exactly('\'test\\n\' +\n\'            abc\'');
        });

        it('single quota: with variable in it', function () {

            const es6string = `\`test
            $\{name\}\``;
            const result = toConcatenatedStrings(es6string, '\'');

            should(result).be.exactly('\'test\\n\' +\n\'            \' + name');
        });

        it('single quota: with variables in it', function () {

            const es6string = `\`your name
            is $\{name\}, but i do not 
            know\``;
            const result = toConcatenatedStrings(es6string, '\'');

            should(result).be.exactly('\'your name\\n\' +\n\'            is \' + name + \', but i do not \\n\' +\n\'            know\'');
        });
    });
});

