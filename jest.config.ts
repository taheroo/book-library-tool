/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./src'],
  globalSetup: './jest.global-setup.ts',
  globalTeardown: './jest.teardown.ts',
  silent: false, 
  verbose: true,  
  testTimeout: 30000,
};