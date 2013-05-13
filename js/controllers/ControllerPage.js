app.ControllerPage = {

	activePage 	: false,
	type		: 'page',

	navigate: function (pageAlias) {

		var pageData = this.getPageDataByAlias(pageAlias); 

		var dynamicPage = new app.ViewPageDynamic();
		dynamicPage.setTitle(pageData.title);
		dynamicPage.setBody(pageData.body);
		dynamicPage.setChildren(pageData.children);
		dynamicPage.setAlias(pageData.alias);
		dynamicPage.setParent(pageData.parent);

		this.activePage = dynamicPage;

		app.dispatcher.trigger('ui.show_page', dynamicPage);
		
	},

	getPageIdByAlias: function (alias) {
		for (var x in cacheData.pages.alias) {
			if (x == alias) {
				return cacheData.pages.alias[x];
			}
		}
		return false;
	},

	getPageDataByAlias: function (alias) {
		return this.getPageDataById(this.getPageIdByAlias(alias));
	},

	getPageDataById: function (pageId) {
		return cacheData.pages.list[pageId];
	},

	backButton: function () {
		if (this.activePage.parent) {
			var pageData = app.ControllerPage.getPageDataById(this.activePage.parent);

			this.activePage.setTitle(pageData.title);
			this.activePage.setBody(pageData.body);
			this.activePage.setChildren(pageData.children);
			this.activePage.setAlias(pageData.alias);
			this.activePage.setParent(pageData.parent);
			this.activePage.render();

			app.router.navigate('page/' + this.activePage.alias);

		} else {
			app.router.navigate('home', {'trigger':true});
		}
	},
}