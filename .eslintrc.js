module.exports = {
    root: true,
    extends: ['universe/native', 'prettier'],
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.d.ts'],
            parserOptions: {
                project: './tsconfig.json'
            }
        }
    ],
    rules: {
        'prettier/prettier': ['error', { endOfLine: 'auto' }]
    }
}
