app.ModelFormOptionSupernaturalAbility = app.ModelFormOption.extend({

	defaults: {
		value: '',
		ability_type: '',
		tactic: '',
	},

	setTactic: function (value) {
		return this.set('tactic', value);
	},

	getTactic: function () {
		return this.get('tactic');
	},

	setAbilityType: function (data) {
		return this.set('ability_type', data);
	},

	getAbilityType: function () {
		return this.get('ability_type');
	},
});