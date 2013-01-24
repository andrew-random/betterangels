// Both powers and aspects are covered by this
app.ModelSupernaturalAbility = Backbone.Model.extend({

	defaults: {
		'type'			: null, // string 	Identifies a unique power
		'name'			: null, // string	Name of this ability
		'good_name'		: null,
		'evil_name'		: null,
		'ability_type'	: null, // string 	'aspect'/'power'
		'good_tactic'	: null, // string 	Tactic for good characters
		'evil_tactic'	: null, // string 	Tactic for good characters
		'description'	: null,	// string 	Full description of ability.
		'short_desc'	: null,	// string 	Oneline summary of ability
	},

	getName: function (characterType) {
		if (characterType == 'angel' && this.get('good_name')) {
			return this.get('good_name');
		} else if (characterType == 'demon' && this.get('evil_name')) {
			return this.get('evil_name');
		}
		return this.get('name');
	},

	getDescription: function() {
		return (this.get('description')) ? this.get('description') : 'No description property available.';
	},

	getUniqueId: function () {
		return this.get('type');
	},

	getTactic: function (characterType) {
		return (characterType == 'angel') ? this.getGoodTactic() : this.getEvilTactic();
	},

	getGoodTactic: function () {
		return this.get('good_tactic');
	},

	getEvilTactic: function () {
		return this.get('evil_tactic');
	},

	getAbilityType: function () {
		return this.get('ability_type');
	},

	setAbilityType: function (value) {
		this.set('ability_type');
	},

	getCost: function () {
		return 2;
	},

	getShortDescription: function () {
		return (this.get('short_desc')) ? this.get('short_desc') : stringTruncate(this.getDescription(), 80);
	},

	getAll: function () {

	}

});
