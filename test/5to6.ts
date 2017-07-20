import * as should from 'should';
import { toTemplateLiteral } from '../src';

describe('5to6, transform', function () {
    describe('single line', function () {
        it('single quota: incorrect format, quote in plain string', function () {

            const es5string = '\'te\'st1\'';
            const func = toTemplateLiteral.bind(null, es5string);
            func.should.throw();
        });

        it('single quota: incorrect format, quote in variable', function () {

            const es5string = '\'test1\' + na\'me + \' ok\'';
            const func = toTemplateLiteral.bind(null, es5string);
            func.should.throw();
        });

        it('single quota: without variable', function () {

            const es5string = '\'test1\'';
            const result = toTemplateLiteral(es5string);
            should(result).be.exactly('`test1`');
        });

        it('single quota: with variable', function () {

            const es5string = '\'test1\' + name + \' ok\'';
            const result = toTemplateLiteral(es5string);
            should(result).be.exactly('`test1${name} ok`');
        });

    });

    describe('multiple lines', function () {

        it('single quota: without variable', function () {

            const es5string = '\'test1\' +\n+ \'ok\'';
            const result = toTemplateLiteral(es5string);
            should(result).be.exactly('`test1ok`');
        });

        it('single quota: without variable, with linebreak', function () {

            const es5string = '\'test1\\n\' +\n+ \' ok\'';
            const result = toTemplateLiteral(es5string);
            should(result).be.exactly('`test1\n ok`');
        });


    });
});

