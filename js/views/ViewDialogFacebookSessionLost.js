app.ViewDialogFacebookSessionLost = app.ViewDialog.extend({

	className : 'ViewDialogFacebookSessionLost',

	title: 'Facebook login required',
	dialogSize: app.ViewDialog.DialogSizeNarrow,

	events: {
		'click .cancel'	: 'hide',
	},
	
	initialize: function () {
		var self = this; // scope hack
        app.dispatcher.on('app.fb_status_change', function (resp) { 
        	
        	// fetch user data if not retrieved
        	if (resp.status === 'connected') {
        		self.hide();
	        }

        }, this);
	},

	render: function () {

		$(this.el).html('<p>Please connect to Facebook to manage your characters.<br /><br />Sorry for the inconvenience!</p>');

		this.loginButtonView = new app.ViewFacebookLoginButton();
      	$(this.el).append(this.loginButtonView.render().el);

      	var html = '';
  		html += '<div class="controls one_button">';
	   	html += '	<div class="fauxlink cancel">Cancel</div>';
	   	html += '</div>';
	   	$(this.el).append(html);

		return this;
	}

});