app.ControllerCharacter = {

	activeView 		: false,
	type 			: 'character',
	loadedFromList 	: false,

	showCharacter: function (uniqueId, loadedFromList) {

		// back button helper
		if (loadedFromList) {
			this.loadedFromList = true;
		}

		var characterModel 	= registry.getCharacterByUniqueId(uniqueId);

	    if (app.user.isLoaded() && !characterModel) {

	      // show loading dialog while we reload data
	      app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogLoading());

	      var self = this; // scope hack

	      // we've initialized, but we can't find character data. We may be looking at another user's character, so we fire a special request.
	      app.fetchCharacterData(uniqueId, _.bind(function (characterData) {
	        
	        var characterModel = new app.ModelCharacter();

	        characterModel.parse(characterData);
	        this.activeView.model = characterModel;
	        this.activeView.render();

	        app.dispatcher.trigger('ui.hide_dialog');

	      }, this));

	    }

	    // we have no data yet, so we delay the user.
	    if (!app.user.isLoaded() && uniqueId != 'new' && !(characterModel && characterModel.getIsPregen())) {

	      // custom character and data is not yet loaded.

	      // show loading dialog while we reload data
	      app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogLoading());

	      // queue page load after ajax has returned
	      app.dispatcher.on('app.init_success', _.bind(function () {
	      	this.activeView.model = registry.getCharacterByUniqueId(uniqueId);
	      	this.activeView.render();

	        // hide any loading dialogs that are still kicking around
	        app.dispatcher.trigger('ui.hide_dialog');

	      }, this));

	    }

	    // the view needs at least a dummy model, so we build one.	
	    if (!characterModel) {
	    	characterModel = new app.ModelCharacter();
	    }

	    // set currently active view
		this.activeView 		= new app.ViewPageCharacterEditor({'model':characterModel});

		// we're always going to show the editor page.
		app.dispatcher.trigger('ui.show_page', this.activeView);

	},

	showCharacters: function (defaultTab) {

		this.activeView = new app.ViewPageCharacterList();
		this.activeView.tabView.showTab(defaultTab, true);

		// load background page with no data
	    app.dispatcher.trigger('ui.show_page', this.activeView);

	    if (!app.fbLoaded) {

	        // queue page load after ajax has returned
	        app.dispatcher.on('app.init_success', _.bind(function () {
	          this.activeView.render();

	        }, this));
	    }
	},

	backButton: function () {
		if (this.loadedFromList) {
			this.loadedFromList = false;

			var defaultTab = (this.activeView.model.getIsPregen() ? 'pregen' : 'custom');
			app.router.navigate('list/' + defaultTab);

			this.showCharacters(defaultTab);

		} else {
			app.router.navigate('home', {'trigger':true});
		}
	},
}