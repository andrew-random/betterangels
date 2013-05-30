app.ViewTabDialogAbilityInfo = app.ViewTab.extend({

	initialize: function (options) {

		if (options && options.option) {
	      this.formOption = options.option;
	      this.formOption.on('change:value', _.bind(function () {
				this.render();
			}, this));
	    }
	},

	canShowTab: function () {
		return this.formOption.getValue();
	},

	render: function() {

		var abilityUniqueId = this.getFormOption().getValue();
		var abilityModel 	= (abilityUniqueId) ? registry.getSupernaturalAbility(abilityUniqueId, this.model.getCharacterType()) : false;

		var html = '';

		html += '<div class="abilityDetails">';
		if (abilityModel) {
			html += '<b>' + abilityModel.getName() + ' <span class="numDice">' + this.model.getNumDice(abilityModel.getTactic(this.model.getCharacterType())) + 'd</span></b>';
			html += abilityModel.getDescription();
		} else {
			html += 'No ability selected.';
		}
		html += '</div>';
		$(this.el).html(html);

		return this;    
	}

});