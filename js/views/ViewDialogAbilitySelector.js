app.ViewDialogAbilitySelector = app.ViewDialog.extend({

	defaults: {
		selectedAbilityUniqueId: false,
		abilityType: null,
		oldAbilityUniqueId: null,
		slot: null,
	},

	selectedAbility: false,

	events: {	
		'click .ability'			: 'showAbility',
		'click .save' 				: 'saveChoice',
		'click .cancel' 			: 'hide',
		'click .groupLabel' 		: 'showAbilityGroupToggle',
	},

	showAbility: function (event) {
		var data = $(event.currentTarget).data();
		this.setSelectedAbility(data.uniqueId);

		var abilityModel = this.getAbilityModel(data.uniqueId);
		$('.abilityDetails .abilityTitle', this.el).html(abilityModel.getName(this.model.getCharacterType()));
		$('.abilityDetails .abilitySubTitle', this.el).html(abilityModel.getTactic(this.model.getCharacterType()));
		$('.abilityDetails .content', this.el).html(abilityModel.getDescription());

		var self = this;
	    $('.fauxlink.ability', this.el).each(function () {
	    	var abilityUniqueId = $(this).data('uniqueId');
	   		var isSelected = abilityUniqueId == self.getSelectedAbility();
	   		if (isSelected) {
	   			$(this).addClass('selected');
	   		} else {
				$(this).removeClass('selected');
	   		}
	    });

	    event.preventDefault();

	},


	showAbilityGroupToggle: function (event) {
	    var target = $(event.currentTarget).parent('.abilityGroup');
	    if (!target.hasClass('active')) {
	    	target.parent().children('.abilityGroup').removeClass('active');
	    	target.addClass('active');
	    }
	    event.preventDefault();
	    
	},

	getAbilityModel: function (abilityName) {
		return registry.getSupernaturalAbility(abilityName, this.model.getCharacterType());
	},

	getAbilitiesByGroup: function () {
		var data = {};
		var self = this; // scope hack
		var abilityCollection = (this.abilityType == app.ModelSupernaturalAbility.AbilityTypePower ? registry.getAllPowers(this.model.getCharacterType()) : registry.getAllAspects(this.model.getCharacterType()));
		abilityCollection.each(function (abilityModel) {
			var tactic = abilityModel.getTactic(self.model.getCharacterType());
			if (typeof data[tactic] == 'undefined') {
				data[tactic] = [];
			}
			data[tactic].push(abilityModel);
		});
		return data;
	},


	saveChoice: function (event) {

		var selectedAbility = this.getSelectedAbility();
		if (selectedAbility) {

			if (this.abilityType == app.ModelSupernaturalAbility.AbilityTypePower && this.model.getPowerBySlot(this.slot) != selectedAbility) {

	        	this.model.addPower(this.slot, selectedAbility);	
				
			} else if (this.abilityType == app.ModelSupernaturalAbility.AbilityTypeAspect && this.model.getAspectBySlot(this.slot) != selectedAbility) {

				this.model.addAspect(this.slot, selectedAbility);
			}
		}

		if (!this.model.isOwner()) {
           	app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
		} else {
			this.hide();
			this.close();
		}

		event.preventDefault();
	},

	setSelectedAbility: function (value) {
		this.selectedAbilityUniqueId = value;
	},

	getSelectedAbility: function () {
		return this.selectedAbilityUniqueId;
	},


	setAbilityType: function (value) {
		this.abilityType = value;
	},

	setAbilityName: function (value) {
		this.abilityName = value;
	},

	setOldAbilityUniqueId: function (value) {
		this.oldAbilityUniqueId = value;
	},

	setSlot: function (value) {
		this.slot = value;
	},

	getTitle: function () {
		return (this.abilityType == app.ModelSupernaturalAbility.AbilityTypePower ? 'Choose Power' : 'Choose Aspect');
	},

	render: function() {

	    var container 				= $(this.el);
	    var abilitiesByGroup 		= this.getAbilitiesByGroup();
	    var previousAbilityModel 	= this.getAbilityModel(this.oldAbilityUniqueId);
	    var defaultAbilityModel		= false;			// if no model is selected, we'll display this by default.
	    var count 					= 0;

	    var html = '';
	    var currentTactic = false

	    html += '<div class="abilityListContainer">';
	    html += '	<div class="abilityList">';
	   
	   	for (var groupLabel in abilitiesByGroup) {
	   		var isActive = false;
	   		if (previousAbilityModel && previousAbilityModel.getTactic(this.model.getCharacterType()) == groupLabel) {
	   			isActive = true;
	   		}
	   		if (!previousAbilityModel && count == 0) {
	   			isActive = true;
	   		}
	   		count++;

	   		html += '<div class="abilityGroup ' + (isActive ? ' active' : '') + '">';
	   		html += '	<div class="fauxlink groupLabel">' + groupLabel + '</div>';
	   		
	   		for (var x in abilitiesByGroup[groupLabel]) {
	   			
	   			var abilityModel 	= abilitiesByGroup[groupLabel][x];

	   			if (!defaultAbilityModel) {
	   				defaultAbilityModel = abilityModel;
	   			}
	   			
	   			var isSelected 		= abilityModel.getUniqueId() == this.getSelectedAbility();
	   			var isLast 			= parseInt(x) + 1== abilitiesByGroup[groupLabel].length;
	   			html += '<div class="fauxlink ability' + (isLast ? ' last' : '') + (isSelected ? ' selected' : '')  + '" data-unique-id="' + abilityModel.getUniqueId() + '">' + abilityModel.getName(this.model.getCharacterType()) + '</div>';
	   		}
	   		html += '</div>';
	   	}
	   	html += '	</div>';
	   	html += '</div>';

	   	html += '<div class="abilityDetails">';
	   	html += '	<div class="abilityTitle">';
	   	if (previousAbilityModel) {
	   		html += previousAbilityModel.getName(this.model.getCharacterType());
	   	} else {
	   		html += defaultAbilityModel.getName(this.model.getCharacterType());
	   	}
	   	html += '	</div>';
	   	html += '	<div class="abilitySubTitle">';
	   	if (previousAbilityModel) {
	   		html += previousAbilityModel.getTactic(this.model.getCharacterType());
	   	} else {
	   		html += defaultAbilityModel.getTactic(this.model.getCharacterType());
	   	}
	   	html += '	</div>';
	   	html += '	<div class="content">';
	   	if (previousAbilityModel) {
	   		html += previousAbilityModel.getDescription();
	   	} else {
	   		html += defaultAbilityModel.getDescription();
	   	}
	   	html += '	</div>';
	   	html += '</div>';

	   	html += '<div class="controls two_buttons">';
	   	html += '	<div class="fauxlink cancel">Cancel</div>';
	   	html += '	<div class="fauxlink save">Select</div>';
	   	html += '</div>';
	   	
	   	container.html(html);

	    return this;    
	},

});