app.ViewFacebookLoginButton = Backbone.View.extend({

    className: 'facebookStatus',

    events: {
      'click .facebookLogin'  : 'facebookLogin', 
    },

	initialize: function () {

		// queue an action to load the homepage when FB is complete.
      app.dispatcher.on('app.init_success', _.bind(function () {
          // load home page
          $(this.el).html('Welcome, <b>' + app.getUser().getName() + '</b>');

      }, this));

      app.dispatcher.on('app.fb_loaded', _.bind(function () {
          if (app.hasFBSession()) {
            // refresh
            $(this.el).html('Logging in...');
         
          } else {
            var html = '';
            html += '<div class="fauxlink facebookLogin">Login</div>';
            $(this.el).html(html);

          }

      }, this));
	},

    onClose: function () {
      // unqueue
    //  app.dispatcher.off('app.init_success');
      app.dispatcher.off('app.fb_loaded');
      
    },

    facebookLogin: function (event) {

      var config = {scope:'email,user_photos,friend_photos'};

      // call login function
      FB.login(function () {}, config);

      event.preventDefault();
    },



    render: function() {

        var html = '';
        if (!app.fbLoaded) {
            
            html += '';//'<div class="fauxlink facebookLogin">Login</div>';

        } else if (app.hasFBSession()) {

            html += 'Welcome, <b>' + app.getUser().getName() + '</b>';

        } else {

            html += '<div class="fauxlink facebookLogin">Login</div>';

        }

        $(this.el).html(html);

        return this;   
    }

});