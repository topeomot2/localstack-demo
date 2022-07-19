/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.{ts,js,jsx}',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/__tests__/**',
        '!**/data/**',
        '!**/tmp/**',
        '!**/src/config/**',
        '!**/scripts/**',
        '!**/dist/**',
        '!<rootDir>/src/server.ts',
        '!<rootDir>/jest.config.js'
    ],
    coverageDirectory: '<rootDir>/tmp/coverage',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/__tests__/**/*.spec.(ts|js)', '**/__tests__/**/*.test.(ts|js)'],
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/setUpEnvJest.js']
};