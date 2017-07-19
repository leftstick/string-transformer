string-transformer
================

[![NPM version][npm-image]][npm-url]
![][travis-url]
![][david-url]
![][dt-url]
![][license-url]

A module helps you transform an ES2016 template literals into concatenated strings, or reverse it back

## Install

```bash
npm i string-transformer
```

## Usage

```typescript
//convert ES2015 template literals into concatenated strings
import { toConcatenatedStrings } from 'string-transformer';

const es6string = '`test1${name}to${age}`';
const result = toConcatenatedStrings(es6string, '\'');

console.log('\'test1\' + name + \'to\' + age' === result);
```



## LICENSE ##

[GPL v3 License](https://raw.githubusercontent.com/leftstick/string-transformer/master/LICENSE)


[npm-url]: https://npmjs.org/package/string-transformer
[npm-image]: https://badge.fury.io/js/string-transformer.png
[travis-url]:https://api.travis-ci.org/leftstick/string-transformer.svg?branch=master
[david-url]: https://david-dm.org/leftstick/string-transformer.png
[dt-url]:https://img.shields.io/npm/dt/string-transformer.svg
[license-url]:https://img.shields.io/npm/l/string-transformer.svg