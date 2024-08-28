import { pathsToModuleNameMapper, JestConfigWithTsJest } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: true,
    },
  },
};

export default jestConfig;
