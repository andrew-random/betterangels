app.ViewPageCharacterEditor = app.ViewPage.extend({

  className: 'page ViewCharacterEditor',

  headerView: null,
  tabView: null,

  initialize: function () {

    // no model passed? s'cool, we'll roll our own.
    if (!this.model) {
        this.model = new app.ModelCharacter();
    }
  },

  /** 
    * Gardbage collection.
    * Attaching a model.on() bind event to a view means that JS will never get rid of that memory leak until explicitly killed.
    * So, we kill things manually.
   */
  onClose: function () {

    // explictly force a model save.
    if (this.model.hasUnsavedChanges()) {
      if (this.model.isNew()) {
        registry.addCustomCharacter(this.model);
      }

      // trigger heartbeat and associated save ops
      app.heartBeat();
      
    }
    
    this.headerView.close();
    this.tabView.close();
  },

  render: function() {
/*
    // if this is a new character, force them to the details dialog.
    if (this.model.isNew() && this.model.isOwner() && !this.model.getCharacterName()) {
        var view = new app.ViewDialogCharacterDetails({model:this.model});
        app.dispatcher.trigger('ui.show_dialog', view);
    }
*/

    $(this.el).empty();
    
    this.headerView = new app.ViewCharacterHeader({model:this.model});
  	$(this.el).append( this.headerView.render().el);

	// add tabs
  	this.tabView = new app.ViewTabs();
  	this.tabView.addTab('abilities', 'Abilities', new app.ViewTabAbilities({model:this.model}));
  	this.tabView.addTab('strategy', 'Strategies', new app.ViewTabStrategy({model:this.model}));
  	this.tabView.addTab('more', 'More', new app.ViewTabMore({model:this.model}));
  	$(this.el).append(this.tabView.render().el);
   	
    
    return this;
  }

});