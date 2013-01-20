app.ViewDialogFacebookSessionLost = app.ViewDialog.extend({

	className : 'ViewDialogFacebookSessionLost',

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

		$(this.el).html('<h1>Facebook login needed.</h1><p>Sorry for the inconvenience!<br /><br /> Please connect to Facebook to manage your characters.</p>');

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