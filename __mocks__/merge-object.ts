import {jest} from '@jest/globals';
const mergeO = jest.fn(()=>{return {target: {offsetHeight: 0}};});

// @ts-ignore
global.mergeObject = mergeO;
