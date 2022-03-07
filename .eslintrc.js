module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['prettier'],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    rules: {
        indent: 'error',
        semi: 'error',
        'no-var': 'error',
        'no-console': 'warn',
        'no-multi-spaces': 'error',
        'space-in-parens': 'error',
        'no-multiple-empty-lines': 'error',
        'prefer-const': 'error',
    },
};
