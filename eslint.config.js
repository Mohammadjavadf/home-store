import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // نادیده گرفتن پوشه‌ها
  { ignores: ['dist', 'node_modules', 'build'] },

  // تنظیمات پایه
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // متغیرهای استفاده‌نشده — با پیشوند _ نادیده گرفته می‌شوند
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      // اجازه استفاده از any در موارد خاص (برای درای‌کردن سریع‌تر)
      '@typescript-eslint/no-explicit-any': 'warn',

      // اجازه importهای side-effect
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  }
);