var AppRouter = Backbone.Router.extend({

  routes: {
    ''                      : 'defaultRoute',
    'home'                  : 'defaultRoute',
    "character/*uniqueId"   : "character",  // #character
    'list'                  : 'character',
    'list/*tab'             : 'character',
    'page/*child'           : 'dynamicPage',
  },

  activeController: false,

  parentPage: false,    // helper for back button

  initialize: function () {
   
    // configure history
    Backbone.history.start({silent:true, pushState: true, root: document.location.pathname + '#'});

    var hasValidRoute = false;
    var cachedCookiePath = $.cookie('path');


    // use existing path if available
    if (document.location.hash) {
      
      hasValidRoute = this.navigate(document.location.hash, {trigger:true});

    } else if (cachedCookiePath) {

      hasValidRoute = this.navigate(cachedCookiePath, {trigger:true});

    } else {

      hasValidRoute = this.navigate('home', {trigger:true});

    }

  },

  defaultRoute: function () {

    this.parentPage = 'home';

    app.dispatcher.trigger('ui.show_page', new app.ViewPageHome());
  },

  character: function(uniqueId) {

    // strip out tabs from hash
    if (uniqueId && uniqueId.indexOf('/tab/') != -1) {
      uniqueId = uniqueId.substring(0, uniqueId.indexOf('/tab/'));
    }

    this.setActiveController(app.ControllerCharacter);
    
    if (uniqueId) {

      // pass info to controller
      this.activeController.showCharacter(uniqueId);
    } else {

      // pass info to controller
      this.activeController.showCharacters();
    }
     
  },

  dynamicPage: function (pageAlias) {

    // strip out tabs from hash
    if (pageAlias) {
      pageAlias = pageAlias.substring(pageAlias.indexOf('/') + 1, 99);
    }

    this.setActiveController(app.ControllerPage);

    // pass info to controller
    this.activeController.navigate(pageAlias);
  },

  backButton: function () {

    if (this.activeController) {
      this.activeController.backButton();  
    } else {
      app.router.navigate('home', {trigger:true});
    }
    
  },

  setActiveController: function (controllerObject) {
    if (!this.activeController || this.activeController.type != controllerObject.type) {
      this.activeController = controllerObject;
      return true;
    }
    return false;
  },

  navigate: function (fragment, options) {

    // record in cookie what the last path was 
    $.cookie('path', fragment, { expires: 7 });

    Backbone.history.navigate(fragment, options);
  },

});