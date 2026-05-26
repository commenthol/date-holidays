module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'break',
				'feat',
				'fix',
				'chore',
				'docs',
				'refactor',
				'revert',
				'test'
			]
		],
		'subject-case': [2, 'never', ['start-case', 'pascal-case']],
		'scope-case': [0]
	}
}
