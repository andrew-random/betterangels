app.ViewPageCharacterList = app.ViewPage.extend({

 	className: 'page ViewCharacterList',

 	initialize: function () {

		// add tabs
		this.tabView = new app.ViewTabs();
		this.tabView.addTab('custom', 'Custom', new app.ViewTabCharacterList({'characterCollection':registry.getAllCustomCharacters()}));
		this.tabView.addTab('pregen', 'Pregen', new app.ViewTabCharacterList({'characterCollection':registry.getAllPregenCharacters()}));
		
 	},

    onClose: function () {
    	this.tabView.close();
    },

	render: function () {
		var container = $(this.el);

		$(this.el).append(this.tabView.render().el);
		      
		return this;
	}
});