app.ViewDialogLoading = app.ViewDialog.extend({

	className : 'ViewDialogLoading',

	title 	  : 'Loading...',

	dialogSize: app.ViewDialog.DialogSizeNarrow,

 	events: {
      'click .cancel'  : 'cancel', 
    },

    cancel: function () {
    	app.router.navigate('', {trigger:true});
    	this.hide();
    },

	render: function () {

		var msgs = [
			'Loading...', 
			'Querying the dark heart of man...', 
			'Searching shadows...', 
			'Wandering the Earth, to and fro.', 
			'Searching...', 
			'Hunting...'
		];

		var loadingMessage = msgs[rand(0, msgs.length - 1)];

		var html = '';
		html += '<div class="loading">' + loadingMessage + '</div>';

		html += '<div class="controls one_button">';
	   	html += '	<div class="fauxlink cancel">Cancel</div>';
	   	html += '</div>'

		$(this.el).html(html);

		return this;
	}

});