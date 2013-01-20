app.ViewApp = Backbone.View.extend({

  statusIconTimeout: false,

  events: {
  	'click .fauxlink.home' : 'showDefaultPage',
  },

  initialize: function (options) {

    app.dispatcher.on('app.facebook_start', this.showFacebookStart, this);
    app.dispatcher.on('app.facebook_connected', this.showFacebookValidUser, this);
    app.dispatcher.on('app.facebook_disconnected', this.showFacebookAnonymousUser, this);

    app.dispatcher.on('app.init_start', this.showInitStart, this);
    app.dispatcher.on('app.init_success', this.showInitSuccess, this);
    app.dispatcher.on('app.init_error', this.showInitError, this);

    app.dispatcher.on('ui.save_start', this.showSaveStart, this);
    app.dispatcher.on('ui.save_success', this.showSaveSuccess, this);
    app.dispatcher.on('ui.save_error', this.showSaveError, this);

    app.dispatcher.on('ui.show_page', this.showPage, this);

    var self = this; // scope hack
    $('#appBackButton').on('click', function (event) { 
        self.backButton();
        event.preventDefault();
    });

  },

  getPage: function () {
      return this.activeView;
  },

  showPage: function (viewObject) {

    // destroy old view
    if (this.activeView) {
        this.activeView.close();
    }

    if (!this.activeView || viewObject.cid != this.activeView.cid ) {
      this.activeView  = viewObject;
      this.render();
    }

  },

  showDefaultPage: function () {
      app.router.navigate('home', {trigger:true});
  },

  showFacebookStart: function () {
      this.showStatusIcons(['facebook', 'busy']);
  },

  showFacebookValidUser: function () {
      this.showStatusIcons(['facebook', 'user']);
      this.queueHideStatusIcons();
  },

   showFacebookAnonymousUser: function () {
      this.showStatusIcons(['facebook', 'anonymous']);
  },

  showInitStart: function () {
		
		// hold the success message for a second
		this.showStatusIcons(['facebook', 'user']);

		var self = this; // scope hack
		this.statusIconTimeout = setTimeout(function () { 
		  self.showStatusIcons(['server', 'busy']);
		}, 1000);

    
  },
  showInitSuccess: function () {
    this.showStatusIcons(['server', 'success']);

    this.queueHideStatusIcons();
  },
  showInitError: function () {
      this.showStatusIcons(['server', 'error']);
  },

  showSaveStart: function () {
      this.showStatusIcons(['disk', 'busy']);
  },

  showSaveSuccess: function () {
      this.showStatusIcons(['disk', 'success']);

      this.queueHideStatusIcons();
  },

  showSaveError: function () {
    this.showStatusIcons(['disk', 'error']);

    this.queueHideStatusIcons();
  },
  
  showStatusIcons: function (iconArray) {
    var html = '';
    for (var x in iconArray) {
      html += '<div class="icon ' + iconArray[x] + '"></div>';
    }
    $('#appStatus').show().html(html);

    if (this.statusIconTimeout) {
      clearTimeout(this.statusIconTimeout);
      this.statusIconTimeout = false;
    }
  },

  queueHideStatusIcons: function (delay) {
    if (!delay) {
      delay = 1500;
    }
    this.statusIconTimeout = setTimeout(function () { 
      $('#appStatus').fadeOut(function () {
        $(this).empty() 
      });
    }, delay);
  },

  render: function() {
    if (this.activeView) {
      $(this.el).html(this.activeView.render().el);
    } else {

      $(this.el).html('No view loaded. <div class="fauxlink home">Return to home?</div>');
    }
    
  },

  backButton: function () {
    app.router.backButton();
  },

});