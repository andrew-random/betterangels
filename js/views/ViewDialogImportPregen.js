app.ViewDialogImportPregen = app.ViewDialog.extend({

	dialogSize: app.ViewDialog.DialogSizeNarrow,

	events: {	
		'click .cancel' 					: 'hide',
		'click .import' 					: 'import',
	},

	title: 'Import Pregen NPC?',

	import: function (event) {

		if (!app.hasFBSession()) {
			
			app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogFacebookSessionLost());

		} else {


			// push new model to custom data list
			var customCharacterModel = registry.importPregen(this.model);

			// hide dialog
			this.hide();

			var activeTab = '/tab/abilities';
			if (document.location.hash.indexOf('/tab/') != -1) {
				activeTab = document.location.hash.substring(document.location.hash.indexOf('/tab/'), 99);
			}

			// trigger new edit page, with the replaced model. 
			app.router.navigate('character/' + customCharacterModel.getUniqueId() + activeTab);
			app.router.activeController.showCharacter(customCharacterModel.getUniqueId());
		
		}

		event.preventDefault();
	},

	render: function() {

	    var container = $(this.el);
	  
	    var html = '';

	    html += '<p>Do you want to make a copy of <b>' + this.model.getRiderName() + '/' + this.model.getCharacterName() + '</b>?</p><p>If not, your changes cannot be saved.</p>';

	    html += '<div class="controls two_buttons">';
	   	html += '	<div class="fauxlink cancel">Cancel</div>';
	   	html += '	<div class="fauxlink import">Import</div>';
	   	html += '</div>';

	   	container.html(html);

	    return this;    
	},

});