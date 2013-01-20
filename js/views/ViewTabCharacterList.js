app.ViewTabCharacterList = Backbone.View.extend({

	characterCollection: null,

	defaults: {
		characterCollection: null,
	},

	views: [],

	initialize: function (options) {
		this.characterCollection = options.characterCollection;
		this.characterCollection.on('add', this.render, this);
		this.views = [];
	},

	onClose: function () {
		for (var x in this.views) {
			this.views[x].close();
		}
		this.views = [];
		this.characterCollection.off('add');
	},

	render: function() {

		var container = $(this.el).empty();
		var count = 0;
		var groups = {};

		this.characterCollection.each(function (characterModel) {

			count++;

			var groupMetaTag = characterModel.getMetaTag('group');
			if (!groupMetaTag) {
				groupMetaTag = 'All';
			}
			if (typeof groups[groupMetaTag] == 'undefined') {
				groups[groupMetaTag] = [];
			}
			groups[groupMetaTag].push(characterModel);
			
		});

		for (var groupName in groups) {
			if (groupName) {
				container.append('<h2 class="groupName">' + groupName + '</h2>');
			}
			for (var y in groups[groupName]) {
				var characterModel = groups[groupName][y];
				var characterEntryView = new app.ViewCharacterListEntry({model:characterModel});
				container.append(characterEntryView.render().el);

				this.views.push(characterEntryView);
			}
		}

		if (!count) {
			if (app.hasFBSession()) {
				container.append('<div class="empty">No characters found.</div>');
			} else {
				if (app.fbLoaded) {
					container.append('<div class="empty">Please login to Facebook to view saved characters.</div>');
				} else {
					container.append('<div class="empty">Loading characters...</div>');
				}				
			}
			

		}
		return this;    
	}

});