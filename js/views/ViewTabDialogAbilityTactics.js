app.ViewTabDialogAbilityTactics = app.ViewTab.extend({

	events: {
		'click .fauxlink.menuItem' : 'selectTactic',
	},

	initialize: function (options) {

		if (options && options.option) {
	      this.formOption = options.option;
	      this.formOption.on('change:tactic', _.bind(function () {
				this.render();
			}, this));
	    }
	},

	selectTactic: function (e) {
		this.formOption.setTactic($(e.target).data('tactic'), {trigger:true});
		e.preventDefault();
	},

	getAbilitiesByGroup: function () {
		var data = {};
		var self = this; // scope hack
		var abilityType = this.formOption.getAbilityType();
		var abilityCollection = (abilityType == app.ModelSupernaturalAbility.AbilityTypePower ? registry.getAllPowers(this.model.getCharacterType()) : registry.getAllAspects(this.model.getCharacterType()));
		abilityCollection.each(function (abilityModel) {
			var tactic = abilityModel.getTactic(self.model.getCharacterType());
			if (typeof data[tactic] == 'undefined') {
				data[tactic] = [];
			}
			data[tactic].push(abilityModel);
		});
		return data;
	},

	render: function() {

		var html = '';

		html += 	'<div class="menu">';
		var abilityGroups = this.getAbilitiesByGroup();
		for (var tactic in abilityGroups) {
			html += 	'<div class="fauxlink menuItem ' + (this.formOption.getTactic() == tactic ? '' : 'inactive') + '" data-tactic="' + tactic + '">';
			html += 		tactic + ' (' + _.size(abilityGroups[tactic]) + ')';
			html += 	'</div>';
		}
		html += 	'</div>';

		$(this.el).html(html);

		return this;    
	}

});