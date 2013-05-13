app.ViewDialogConfirmDelete = app.ViewDialog.extend({

	dialogSize: app.ViewDialog.DialogSizeNarrow,

	events: {	
		'click .cancel' 					: 'hide',
		'click .delete' 					: 'delete',
	},

	title: 'Destroy utterly?',


	delete: function (event) {

		this.model.destroy();

		this.hide();

		event.preventDefault();

		
	},

	render: function() {

	    var container 		= $(this.el);
	  
	    var html = '';

	    html += '<p>Are you sure you want to delete <b>' + (this.model.getRiderName() ? this.model.getRiderName() : 'Rider Name') + '/' + (this.model.getCharacterName() ? this.model.getCharacterName() : 'Character Name') + '</b>?<br /><br />This cannot be undone.</p>';

	    html += '<div class="controls two_buttons">';
	   	html += '	<div class="fauxlink cancel">Cancel</div>';
	   	html += '	<div class="fauxlink delete">Delete</div>';
	   	html += '</div>';

	   	container.html(html);

	    return this;    
	},

});