app.ViewCharacterListEntry = Backbone.View.extend({

	events: {
		'click .fauxlink.view' 		: 'viewCharacter',
		'click .fauxlink.delete'	: 'deleteCharacter',
	},

	initialize: function () {
		this.model.on('ajax_busy', this.ajaxBusy, this);
		this.model.on('destroy', this.characterDeath, this);
	},

	onClose: function () {
		this.model.off('ajax_busy');
	},

	ajaxBusy: function (value) {
		if (value) {
			$('.characterRow', this.el).addClass('loading');
		} else {
			$('.characterRow', this.el).removeClass('loading');
		}
	},

	characterDeath: function () {
		var self = this; // scope hack

		self.remove();
		
	},

	viewCharacter: function (event) {
		
		app.router.navigate('character/' + this.model.getUniqueId());
      	app.router.activeController.showCharacter(this.model.getUniqueId(), true);

		event.preventDefault();
	},

	deleteCharacter: function (event) {

		app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogConfirmDelete({model:this.model}));
		event.preventDefault();
	},

	render: function() {

		var html = '';
		html += '<div class="characterRow ' + this.model.getCharacterType() + '">';

		// delete button
		if (this.model.isOwner()) {
			html += '<div class="fauxlink delete"></div>';
		}

		html += '	<div class="loading">&nbsp;</div>';

		// view button
		html += '	<div class="fauxlink view">';
		
		var imageStyle = '';
		if (this.model.hasImageUrl()) {
            imageStyle = 'style="background-image:url(' + this.model.getImageUrl() + ');"';
        }
    	html += '	<div class="image" ' + imageStyle + '></div>';
		html += '	<div class="rider">' + (this.model.getRiderName() ? this.model.getRiderName() : 'Rider Name') + '</div>';
		html += '	<div class="character">' + (this.model.getCharacterName() ? this.model.getCharacterName() : 'Character Name')+ '</div>';

		html += '	<div class="cost">Cost: ' + this.model.getTotalCost() + '</div>';
		html += '</div>';

		
		html += '</div>';

		$(this.el).html(html);
		return this;    
	}

});