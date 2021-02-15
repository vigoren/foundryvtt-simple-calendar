import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    roots: [ "<rootDir>/src" ],
    moduleFileExtensions: ["js", "jsx", "json", "node", "ts"],
    testEnvironment: 'node',
    testMatch: [ "**/?(*.)+(spec|test).+(ts|tsx|js)" ],
    transform: {"^.+\\.(ts|tsx)$": "ts-jest"},
    collectCoverage: true,
    coverageDirectory: './docs/coverage',
    //coverageReporters: ["html","clover"]
};
export default config;
