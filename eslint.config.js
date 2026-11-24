// Every coding rule in docs/CODING.md that a tool can check is enforced here.
import eslint from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import nodePlugin from 'eslint-plugin-n';
import tsdoc from 'eslint-plugin-tsdoc';
import tseslint from 'typescript-eslint';

const MIN_NODE_VERSION = '>=22.18.0';
// Coding rule 2 limits (docs/CODING.md)
const MAX_COMPLEXITY = 10;
const MAX_PARAMS = 3;
const MAX_DEPTH = 3;
const MAX_FUNCTION_LINES = 20;
const MIN_IDENTIFIER_LENGTH = 2;
const LIBRARY_SOURCES = ['js/packages/*/src/**/*.ts'];
const GENERATED_SOURCES = ['js/packages/*/src/generated/**'];
const TEST_FILES = ['**/*.test.ts', '**/*.bench.ts', 'js/test-runner/**'];

const namingRules = [
  { selector: 'default', format: ['camelCase'], leadingUnderscore: 'forbid' },
  { selector: 'import', format: ['camelCase', 'PascalCase'] },
  {
    selector: 'parameter',
    modifiers: ['unused'],
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },
  { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
  { selector: 'typeLike', format: ['PascalCase'] },
  { selector: 'enumMember', format: ['UPPER_CASE'] },
  { selector: 'objectLiteralProperty', format: null },
  { selector: 'typeProperty', format: null },
  {
    selector: ['variable', 'parameter', 'accessor'],
    types: ['boolean'],
    format: ['PascalCase'],
    prefix: ['is', 'has', 'can', 'should', 'was'],
  },
];

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', 'php/**', 'coverage/**', 'docs/site/lib/**'] },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // Rule 1 — names carry the meaning
      '@typescript-eslint/naming-convention': ['error', ...namingRules],
      'id-length': [
        'error',
        { min: MIN_IDENTIFIER_LENGTH, exceptions: ['i', 'n', '_'], properties: 'never' },
      ],
      // Rule 2 — one function, one job
      complexity: ['error', MAX_COMPLEXITY],
      'max-params': ['error', MAX_PARAMS],
      'max-depth': ['error', MAX_DEPTH],
      // Rule 4 — immutable data
      'prefer-const': 'error',
      'no-param-reassign': ['error', { props: true }],
      '@typescript-eslint/prefer-readonly': 'error',
      // Rule 5 — strict types
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      // Rule 6 — no magic values anywhere (library, tools, tests): name every literal
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          enforceConst: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          detectObjects: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
        },
      ],
      // Performance — regexes built once
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
    },
  },
  {
    files: LIBRARY_SOURCES,
    plugins: { jsdoc, tsdoc, n: nodePlugin },
    settings: { node: { version: MIN_NODE_VERSION } },
    rules: {
      // Minimum-version syntax, checked not remembered
      'n/no-unsupported-features/es-syntax': 'error',
      'n/no-unsupported-features/es-builtins': 'error',
      'n/no-unsupported-features/node-builtins': 'error',
      // Rule 2 — about 20 lines max, no flag arguments
      'max-lines-per-function': [
        'error',
        { max: MAX_FUNCTION_LINES, skipBlankLines: true, skipComments: true },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: ':function > Identifier.params > TSTypeAnnotation > TSBooleanKeyword',
          message: 'No flag arguments: split into two functions or take an options value.',
        },
        {
          selector: 'ClassDeclaration[superClass.name!="Error"][superClass]',
          message: 'No inheritance hierarchies: share logic with small internal functions.',
        },
      ],
      // Rule 3 — pure by default: no I/O, globals or hidden state
      'no-console': 'error',
      'no-restricted-globals': ['error', 'process', 'window', 'document', 'globalThis'],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['node:*', 'fs', 'path', 'os', 'http', 'https'],
              message: 'Library code does no I/O.',
            },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Date', property: 'now', message: 'Pass the date in; library code is pure.' },
        { object: 'Math', property: 'random', message: 'Library code is deterministic.' },
      ],
      // Rule 6 — no magic values: Malagasy values come from generated constants
      // Public API docs are required, with one example
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: { esm: true },
          require: { FunctionDeclaration: true, ClassDeclaration: true },
        },
      ],
      'jsdoc/require-example': [
        'error',
        {
          exemptedBy: ['internal'],
          contexts: [
            'ExportNamedDeclaration > FunctionDeclaration',
            'ExportNamedDeclaration > ClassDeclaration',
          ],
        },
      ],
      'jsdoc/require-description': ['error', { exemptedBy: ['internal'] }],
      'jsdoc/require-param': ['error', { checkDestructured: false }],
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/check-tag-names': ['error', { definedTags: ['internal', 'remarks', 'throws'] }],
      'tsdoc/syntax': 'error',
    },
  },
  {
    files: GENERATED_SOURCES,
    rules: { '@typescript-eslint/no-magic-numbers': 'off', 'max-lines-per-function': 'off' },
  },
  {
    files: TEST_FILES,
    rules: {
      'max-lines-per-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
