var app = {

	apiUrl	 			: 'http://cardboardshark.com/BA/api.php',	// url string where commands should be sent.
	appId 				: '266561183460054',
	appView				: null,		// View - highest level app container view
	dialogView			: null,		// View - highese level dialog container view
	dispatcher			: null,		// Event handler
	user 				: null,		// Model - currently active FB user
	fbLoaded 			: false,
	fbStatus 			: null,		// locally cached string of current FB status
	
	heartbeatInterval 	: null,		// JS repeating interval
	heartBeatFrequency	: 10000, 	// ms between beats

	isFetchingInitData	: false,	// prevent the initial heavy ajax init requests from duplicating

	initialize: function () {

		// ready static data
		registry.initialize();

		// create a generic user
		this.user = new app.ModelUser();

		// all app-level events get passed to this chap
		this.dispatcher = _.clone(Backbone.Events);

		// root view ( always active )
		this.appView = new app.ViewApp({el:document.getElementById('appContent')});

		// root dialog view ( hidden by default )
		this.dialogView = new app.ViewDialog({el:document.getElementById('appDialog')});

		// on window unload, make sure the save operation runs.
		$(document).on('unload', function () {
			app.heartBeat(); 
		})

        // hack to use my testing app instead
        if (document.location.host.indexOf('andrew') != -1) {
            this.appId 	= '334605606498'; 
            this.apiUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + 'api.php';
        }

        // trigger FB 
        if (typeof FB != 'undefined') {

        	app.dispatcher.trigger('app.facebook_start');

        	// Trigger the FB remote JS
	        FB.init({
	            appId 	: this.appId,
	            cookie 	: true, 
	            status 	: true,
	        });

	        // attach app event handler to FB's event handler.
	        FB.Event.subscribe('auth.statusChange', function (resp) {
	        	app.dispatcher.trigger('app.fb_status_change', resp);
	        });

	        // explicitly call for login status ( if the user is 'unknown', then the statusChange event never gets called by FB. )
	        FB.getLoginStatus(function (resp) {
	        	app.dispatcher.trigger('app.fb_status_change', resp);
	        });

        } else {

			// wave an error message
			var errorMessage = {
				'title': 'Contract unfulfilled',
				'body': 'Facebook did not return required JS.',
				'type': 'error'
			};
			app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogPHPMessage(errorMessage));

        }
        

        // do our own event handling
        this.dispatcher.on('app.fb_status_change', function (resp) { 

        	var previousStatus = app.fbStatus;
        	app.fbStatus = resp.status;

            if (!app.fbLoaded) {
            	
            	app.fbLoaded = true;

            	// notify listeners that FB methods are now available
            	app.dispatcher.trigger('app.fb_loaded');

            	// display first time login icons
            	if (resp.status === 'connected') {
		        	app.dispatcher.trigger('app.facebook_connected');
		        } else {
		        	app.dispatcher.trigger('app.facebook_disconnected');
		        }

        	}

	        if (previousStatus === 'connected' && resp.status !== 'connected') {
	        	app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogFacebookSessionLost());
	        	app.dispatcher.trigger('app.facebook_disconnected');
	        }

	        
	        // fetch user data if not retrieved
        	if (resp.status === 'connected' && !app.user.isLoaded() && !registry.charactersLoaded) {
				app.fetchInitData();
	        }

        }, this);
 
        // push content to the browser
		this.appView.render();

		// trigger the page router ( connects url#pagename -> specific callback)
		this.router = new AppRouter();

		// queue that first heartbeat
		this.heartBeat();		

	},

	fetchInitData: function () {

		if (this.isFetchingInitData) {
			return false;
		}
		this.isFetchingInitData = true;

		app.dispatcher.trigger('app.init_start');

		app.api(
			'init', 
			{}, 
			_.bind(function (resp) {
				if (app.user.isLoaded() && registry.charactersLoaded) {
					app.dispatcher.trigger('app.init_success');
				}
				app.isFetchingInitData = false;
			}, this), 
			_.bind(function () {
				// error callback
				app.dispatcher.trigger('app.init_error');
				app.isFetchingInitData = false;

				// wave an error message
				var errorMessage = {
					'title': 'Contract unfulfilled',
					'body': 'The server is not responding.<br /> Please restart the app and try again.',
					'type': 'error'
				};
				app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogPHPMessage(errorMessage));

			}, this)
		);

	},

	fetchCharacterData: function (uniqueId, successCallback, errorCallback) {
		app.api(
			'get_character', 
			{'unique_id':uniqueId}, 
			_.bind(function (resp) {
				if (successCallback) {
					successCallback(resp.character);
				}
			}, this), 
			_.bind(function (ajaxResp) {
				if (errorCallback) {
					errorCallback(ajaxResp);
				}

			}, this)
		);
	},

	hasFBSession: function () {
		return app.fbStatus === 'connected';
	},

	heartBeat: function () {

		if (this.hasFBSession()) {

			// cycle through the registry, saving character models that have unsaved changes
			registry.getAllCustomCharacters().each(function (characterModel) {
				
				if (characterModel.hasUnsavedChanges() && !characterModel.ajaxBusy) {

					characterModel.setAjaxBusy(true);

					app.dispatcher.trigger('ui.save_start');
					
					characterModel.save(function () {
							
							characterModel.setAjaxBusy(false);
							app.dispatcher.trigger('ui.save_success');

						},
						function () {

							characterModel.setAjaxBusy(false);
							app.dispatcher.trigger('ui.save_error');

						}
					);
					
				}
			});
		}

		// queue next heartbeat
		this.heartbeatInterval = setTimeout(function () { app.heartBeat() }, this.heartBeatFrequency);

	},

	setUser: function (userModel) {
		this.user = userModel;
	},

	getUser: function () {
		return this.user;
	},

	api: function (action, params, successCallback, errorCallback) {

		// these props are always included.
		if (!params) {
			params = {};
		}
		params['action'] = action;
		params['access_token'] = FB.getAccessToken();

		$.ajax({
			url: 		app.apiUrl,
			data: 		params,
			dataType: 	'json',
			type: 		'POST',
			success: 	function (resp) {

				// update user object
				if (resp.user) {
					app.user.set(resp.user);
				}

				// update custom characters
				if (resp.characters) {
					for (var x in resp.characters) {

						var characterData = resp.characters[x];
						var characterModel = new app.ModelCharacter();
						characterModel.parse(characterData);

						// push to registry if not already found
						registry.addCustomCharacter(characterModel);

					}
					registry.charactersLoaded = true;
				}

				// interpret attached messages
				if (resp.messages) {
					// todo: convert to queue system
					if (resp.messages.length > 0) {
						app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogPHPMessage(resp.messages[0]));
					}	
				}
				
				if (successCallback) { 
					successCallback(resp);
				}
			},
			error: 	function (ajaxObject) { 
				if (errorCallback) { 
					errorCallback(ajaxObject);
				} 
			}
		})
	},

	/**
	  * GET a request from the FB API
	  */
	fbGetGraph: function (url, successCallback, errorCallback) {
		$.ajax({
			url:'https://graph.facebook.com/' + url + (url.indexOf('?') === -1 ? '?' : '&') + 'access_token=' + FB.getAccessToken(),
			dataType: 'json',
			success: function (resp) { successCallback(resp) },
			error: function (ajaxObject) { if (errorCallback) { errorCallback(ajaxObject);} }
		});
	},

	fbGetPhotoUrl: function (photoId, size) {
		if (!size) {
			size = 'picture';
		}
		return 'https://graph.facebook.com/' + photoId + '/picture?type=' + size + '&access_token=' + FB.getAccessToken();
	},
}