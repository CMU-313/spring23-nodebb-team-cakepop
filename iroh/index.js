/* eslint-disable */
'use strict';

const Iroh = require('iroh');
const utils = require('../src/utils.js');

let stage = new Iroh.stage(`utils.isEmailValid("emailemail@gmail.com");`);

eval(stage.script);