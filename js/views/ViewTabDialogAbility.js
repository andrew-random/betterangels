app.ViewTabDialogAbility = app.ViewTab.extend({

	tactic: false,

	events: {
		'click .fauxlink.menuItem' : 'selectValue',
	},

	initialize: function (options) {

		if (options && options.option) {
	      this.formOption = options.option;
	      this.formOption.on('change:tactic', _.bind(function () {
				this.render();
			}, this));
	      this.formOption.on('change:value', _.bind(function () {
				this.render();
			}, this));
	    }
	},

	selectValue: function (e) {
		this.formOption.setValue($(e.target).data('ability'), {trigger:true});
		e.preventDefault();
	},

	canShowTab: function () {
		return this.formOption.getTactic();
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

			if (this.formOption.getTactic() == tactic) {
				for (var x in abilityGroups[tactic]) {
					html += 	'<div class="fauxlink menuItem ' + (this.formOption.getValue() == abilityGroups[tactic][x].getUniqueId() ? '' : 'inactive') + '" data-ability="' + abilityGroups[tactic][x].getUniqueId() + '">';
					html += 		abilityGroups[tactic][x].getName();
					html += 	'</div>';
				}
			}
		}
		html += 	'</div>';

		$(this.el).html(html);

		return this;    
	}

});