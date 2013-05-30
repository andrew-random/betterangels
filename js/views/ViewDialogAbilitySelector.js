app.ViewDialogAbilitySelector = app.ViewDialog.extend({

	defaults: {
		selectedAbilityUniqueId: false,
		abilityType: null,
		slot: null,
	},

	selectedAbility: false,
	formOption: null,

	events: {	
		'click .save' 				: 'saveChoice',
		'click .cancel' 			: 'hide',
	},

	initialize: function () {

		this.formOption = new app.ModelFormOptionSupernaturalAbility();

		// add tabs
		this.tabView = new app.ViewSequentialTabs();
		this.tabView.addTab('tactic', 'Tactic', new app.ViewTabDialogAbilityTactics({model:this.model, option:this.formOption}));
		this.tabView.addTab('ability', 'Ability', new app.ViewTabDialogAbility({model:this.model, option:this.formOption}));
		this.tabView.addTab('info', 'Info', new app.ViewTabDialogAbilityInfo({model:this.model, option:this.formOption}));

		this.tabView.setChangeLocationOnClick(false);

		// set the default
		this.tabView.setActiveTab('tactic');

		this.formOption.on('change:tactic', function () {
			this.tabView.updateTabRow();
			this.tabView.showTab('ability', true);
		}, this);

		this.formOption.on('change:value', function () {
			this.tabView.updateTabRow();
			this.tabView.showTab('info', true);
		}, this);

	},

	onClose: function () {
    	this.tabView.close();
    },

	saveChoice: function (event) {

		var selectedAbility = this.getSelectedAbility();
		if (selectedAbility) {

			if (this.getAbilityType() == app.ModelSupernaturalAbility.AbilityTypePower && this.model.getPowerBySlot(this.slot) != selectedAbility) {
	        	this.model.addPower(this.slot, selectedAbility);	
				
			} else if (this.getAbilityType() == app.ModelSupernaturalAbility.AbilityTypeAspect && this.model.getAspectBySlot(this.slot) != selectedAbility) {
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
		this.formOption.setValue(value);	
	},

	getSelectedAbility: function () {
		return this.formOption.getValue();
	},

	setTactic: function (value) {
		this.formOption.setTactic(value);	
	},

	getTactic: function () {
		return this.formOption.getTactic();
	},


	setAbilityType: function (value) {
		this.formOption.setAbilityType(value);
	},
	getAbilityType: function () {
		return this.formOption.getAbilityType();
	},

	setSlot: function (value) {
		this.slot = value;
	},

	getTitle: function () {
		return (this.formOption.getAbilityType() == app.ModelSupernaturalAbility.AbilityTypePower ? 'Choose Power' : 'Choose Aspect');
	},

	render: function() {

		$(this.el).html(this.tabView.render().el);

		// if an ability is shown, show it by default
		if (this.formOption.getValue()) {
			this.tabView.setActiveTab('info');
			this.tabView.showTab('info', true);
		}

		var html = '';
		html += '<div class="controls two_buttons">';
	   	html += '	<div class="fauxlink cancel">Cancel</div>';
	   	html += '	<div class="fauxlink save">Select</div>';
	   	html += '</div>';
		$(this.el).append(html);

	    return this;    
	},

});