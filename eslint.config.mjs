import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    'antfu/if-newline': 'off',
    'node/prefer-global/process': 'off',
    'style/brace-style': ['error', '1tbs'],
    'vue/no-unused-refs': 'off',
  },
})
