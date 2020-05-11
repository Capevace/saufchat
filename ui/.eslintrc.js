module.exports = {
	root: true,

	env: {
		node: true
	},

	parserOptions: {
		parser: '@typescript-eslint/parser'
	},

	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-tabs': 0,
		indent: 0,
		'prettier/prettier': [
			'warn',
			{
				'#': 'prettier config in here :)',
				singleQuote: true,
				semi: true,
				trailingComma: 'none',
				tabWidth: 4,
				useTabs: true
			}
		],
		'vue/no-unused-vars': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['error'],
		'vue/script-indent': 'off'
	},

	extends: [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/prettier',
		'@vue/typescript'
	]
};
