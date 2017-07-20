import * as should from 'should';
import { toTemplateLiteral } from '../src';

describe('5to6, transform', function () {
    describe('single line', function () {
        it('single quota: incorrect format, quote in plain string', function () {

            const es5string = '\'te\'st1\'';
            const func = toTemplateLiteral.bind(null, es5string);
            func.should.throw();
        });

        it('single quota: incorrect format, es6 string', function () {

            const es5string = '`te\'st1`';
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

        it('single quota: without variable, with linebreak', function () {

            const es5string = '\'your name \\n\' +\n\'is \' + name + \', but \\n\' +\n\'you are stupid\'';
            const result = toTemplateLiteral(es5string);
            should(result).be.exactly('`your name \nis ${name}, but \nyou are stupid`');
        });

        it('single quota: with expression', function () {

            const es5string = '\'<div class="content">\' +\n\'<table><tr class="\' + hideExperience + \'">\' +\n\'<td class="f2 text-orange \' + centerExp + \'" width="30%">\' + (data.experience > 0 ? data.experience : \'—\') + \'</td>\' +\n\'<td class="f6" width="70%">Years of Experience</td></tr>\' +\n\'</div>\'';
            const result = toTemplateLiteral(es5string);
            should(result).be.exactly('`<div class="content"><table><tr class="${hideExperience}"><td class="f2 text-orange ${centerExp}" width="30%">${(data.experience > 0 ? data.experience : \'—\')}</td><td class="f6" width="70%">Years of Experience</td></tr></div>`');
        });


    });
});

