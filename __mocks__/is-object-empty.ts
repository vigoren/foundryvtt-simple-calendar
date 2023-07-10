import {jest} from '@jest/globals';
const ioe = jest.fn();

// @ts-ignore
global.isObjectEmpty = ioe;
