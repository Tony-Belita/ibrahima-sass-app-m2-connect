// Configuration ESLint pour ignorer temporairement certaines erreurs non-critiques
module.exports = {
  rules: {
    // Permettre l'utilisation de 'any' dans certains contextes spécifiques
    '@typescript-eslint/no-explicit-any': [
      'error',
      {
        ignoreRestArgs: true,
      },
    ],
    // Permettre les variables non utilisées qui commencent par _
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    // Permettre les caractères non échappés dans certains contextes
    'react/no-unescaped-entities': [
      'error',
      {
        forbid: ['>', '}'],
      },
    ],
  },
}
