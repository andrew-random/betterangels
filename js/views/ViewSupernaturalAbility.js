app.ViewSupernaturalAbility = Backbone.View.extend({

	abilityModel : false,
	slot: 'new',
	className: 'abilityBox',
	isPower: false,
	mode: false,
	isNew: false,

    events: {
	   	'click .fauxlink.add'           : 'showPopup',
	    'click .fauxlink.ability'       : 'showPopup',
	    'click .fauxlink.edit'         	: 'showPopup',
	    'click .fauxlink.delete'        : 'showDelete',
	    'click .fauxlink.deleteCancel'  : 'cancelDelete',
	    'click .fauxlink.deleteConfirm' : 'confirmDelete',
    },

	initialize: function () {
		this.model.on('stat_change', this.checkUpdate, this);
        this.model.on('change change:rider_strategy', this.checkUpdate, this);
        this.setMode(app.ViewSupernaturalAbility.ModeView);
	},

	setAbilityModel: function (model) {
		this.abilityModel = model;
	},

	getAbilityModel: function () {
		return this.abilityModel;
	},

	setSlot: function (value) {
		this.slot = value;
	},

	setIsPower: function(value) {
		this.isPower = value;
	},

	setIsNew: function (value) {
		this.isNew = value;
	},
	getIsNew: function () {
		return this.isNew;
	},

	setMode: function (value) {
		this.mode = value;
	},

	getMode: function () {
		return this.mode;
	},

    checkUpdate: function (updatedStat) {
        /*if (updatedStat == this.statGood || updatedStat == this.statEvil) {
           this.updateStatBars();
        }
        if (this.model.hasChanged('rider_strategy')) {
            var riderStrategy = this.model.get('rider_strategy');
            if (riderStrategy == this.statGood || riderStrategy == this.statEvil) {
                this.setPrimaryStrategy(riderStrategy);
                this.render();
            } else if (this.primaryStrategy != riderStrategy) {
                this.setPrimaryStrategy(false);
                this.render();
            }
        }
        return true;*/
    },

    showDelete: function () {
    	this.setMode(app.ViewSupernaturalAbility.ModeDelete);
    	this.render();
    },

    cancelDelete: function () {
    	this.setMode(app.ViewSupernaturalAbility.ModeEdit);
    	this.render();
    },

    confirmDelete: function () {
    	if (this.isPower) {
			this.model.removePowerBySlot(this.slot);
		} else {
			this.model.removeAspectBySlot(this.slot);
		}
    },

    showPopup: function (event) {

		var view = new app.ViewDialogAbilitySelector({model:this.model});
		view.setAbilityType(this.isPower ? app.ModelSupernaturalAbility.AbilityTypePower : app.ModelSupernaturalAbility.AbilityTypeAspect);		
		view.setSlot(this.slot);

		if (this.abilityModel) {
			view.setTactic(this.abilityModel.getTactic(this.model.getCharacterType()), {trigger:false});
			view.setSelectedAbility(this.abilityModel.getUniqueId(), {trigger:false});
		}

	    app.dispatcher.trigger('ui.show_dialog', view);
	    event.preventDefault();

	},

    render: function() {        

		var html = '';

		$(this.el).prop('className', this.className + ' ' + this.mode + ' ' + (this.isNew ? 'new' : ''));

		switch (this.getMode()) {

			case app.ViewSupernaturalAbility.ModeView:
				html += '<div class="name">';
				if (this.abilityModel) {
					html += 	this.abilityModel.getName(this.model.getCharacterType()) + ' ';
					html +=  	'(' + this.abilityModel.getTactic(this.model.getCharacterType()) + ') ';
					html +=		'<span class="numDice">' + this.abilityModel.getNumDice(this.model) + 'd</span>';	
				}
				html += '</div>';
				html += '<div class="shortDesc">';
				if (this.abilityModel) {
					html += 	this.abilityModel.getShortDescription();
				}
				html += '</div>';

				break;

			case app.ViewSupernaturalAbility.ModeEdit:

				if (this.abilityModel) {
				  html += '<div class="fauxlink action delete"></div>';	
				  html += '<div class="fauxlink edit">';
				  html += 	'<div class="name">' + this.abilityModel.getName(this.model.getCharacterType()) + ' (' + this.abilityModel.getTactic(this.model.getCharacterType()) + ') ' + this.abilityModel.getNumDice(this.model) + 'd </div>';
				  html += 	'<div class="shortDesc">' + this.abilityModel.getShortDescription() + '</div>';
				  html += '</div>';

				} else {
				  html += '<div class="fauxlink action add"></div>';	
				  html += '<div class="name">Tap to add ' + (this.isPower ? 'a power' : 'an aspect') + '</div>';
				  html += '<div class="shortDesc"></div>';
				}
				break;

			case app.ViewSupernaturalAbility.ModeDelete:
				html += '<div class="deleteBox">';
				html += '   <b>Remove ' + this.abilityModel.getName() + '?</b>';

				html += '   <div class="fauxlink deleteCancel">';
				html += '     Cancel';
				html += '   </div>';

				html += '   <div class="fauxlink deleteConfirm">';
				html += '     Delete';
				html += '   </div>';

				html += '</div>';
				break;

		}

        $(this.el).html(html);

        return this;    
    }

});

app.ViewSupernaturalAbility.ModeView = 'view';
app.ViewSupernaturalAbility.ModeEdit = 'edit';
app.ViewSupernaturalAbility.ModeDelete = 'delete';
