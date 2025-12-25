import { nextJsConfig } from '@workspace/config-eslint/next-js';

/** @type {import("eslint").Linter.Config[]} */
export default [
    {
        ignores: ['.next/**', 'out/**', 'dist/**', 'build/**'],
    },
    ...nextJsConfig,
];
