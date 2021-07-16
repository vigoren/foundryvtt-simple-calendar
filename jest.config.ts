import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    roots: [ "<rootDir>/src" ],
    moduleFileExtensions: ["js", "jsx", "json", "node", "ts"],
    testEnvironment: 'node',
    testMatch: [ "**/?(*.)+(spec|test).+(ts|tsx|js)" ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.svg$": "jest-transform-stub"
    },
    collectCoverage: true,
    coverageDirectory: './docs/coverage'
};
export default config;
