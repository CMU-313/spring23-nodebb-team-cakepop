/* eslint-disable */
'use strict';

const Iroh = require('iroh');
const utils = require('../src/utils');

let stage = new Iroh.Stage(`
utils.isPasswordValid("long enough");
`);

stage.addListener(Iroh.CALL)
.on('before', (e) => {
  console.log(' '.repeat(e.indent), 'call', e.name + '(' + e.arguments + ')');
}).on('after', (e) => {
  console.log(' '.repeat(e.indent), 'end', e.name);
});

// program
stage.addListener(Iroh.PROGRAM)
.on('enter', (e) => {
  console.log(' '.repeat(e.indent) + 'Program enter');
})
.on('leave', (e) => {
  console.log(' '.repeat(e.indent) + 'Program exit', '->', e.return);
});

eval(stage.script);