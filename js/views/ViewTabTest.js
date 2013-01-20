app.ViewTabTest = Backbone.View.extend({

	name: null,

	initialize: function (options) {
		this.name = options.name;
	},

	render: function() {

		$(this.el).html('ping ' + this.name);

		return this;    
	}

});