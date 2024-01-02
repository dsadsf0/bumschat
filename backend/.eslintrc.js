module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js', '.prettierrc'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-empty-function': 'off',
        indent: ['error', 'tab', { SwitchCase: 1, ignoredNodes: ['PropertyDefinition'] }],
        quotes: [2, 'single', { allowTemplateLiterals: true, avoidEscape: true }],
		semi: ['error', 'always'],
        'max-len': ['warn', { code: 160 }],
		'operator-linebreak': ['error', 'before'],
		'dot-location': ['error', 'property'],
        'lines-between-class-members': ['error', 'always'],
        'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
        'linebreak-style': ['error', 'windows'],
		'object-curly-spacing': ['error', 'always']
    },
};
