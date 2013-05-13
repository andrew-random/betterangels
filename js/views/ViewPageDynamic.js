app.ViewPageDynamic = app.ViewPage.extend({

	className: 'page dynamic',

	events: {
		'click .fauxlink.menuItem' : 'clickChildPage',
	},

	initialize: function () {
		this.title = 'Title';
		this.body = 'Body';
		this.children = [];
	},

	clickChildPage: function (event) {
		var target = $(event.currentTarget);
		var alias = target.data('alias');
		app.router.navigate('page/' + this.alias + '/' + alias);

		this.loadPage(app.ControllerPage.getPageDataByAlias(alias));

		event.preventDefault();
	},

	loadPage: function (pageData) {

		this.setTitle(pageData.title);
		this.setBody(pageData.body);
		this.setChildren(pageData.children);
		this.setAlias(pageData.alias);
		this.setParent(pageData.parent);

		this.render();
	},

	setTitle: function (value) {
		this.title = value;
	},

	setBody: function (value) {
		this.body = value;
	},

	setChildren: function (data) {
		this.children = data;
	},

	setAlias: function (value) {
		this.alias = value;
	},

	setParent: function (value) {
		this.parent = value;
	},

	render: function () {

		var container = $(this.el);

		var html = '';
		html += '<div class="wrapper clear-block">';
		html += '	<h1>' + this.title + '</h1>';
		html += '	<div class="body">' + this.body + '</div>';

		if (this.children.length > 0) {
			html += 	'<div class="menu">';
			for (var pageId in this.children) {
				var childPageData = app.ControllerPage.getPageDataById(this.children[pageId]);
				html += '	<div class="fauxlink menuItem" data-alias="' + childPageData['alias'] + '">';
				html += '		<span>' + childPageData['title'] + '</span>';
				html += '	</div>';
			}
			html += 	'</div>';
		}
				
		html += '</div>';
		container.html(html);

		return this;
	}

});
