app.ViewTab = Backbone.View.extend({

	formOption : null,

	initialize: function (options) {
	    if (options && options.option) {
	      this.formOption = options.option;
	    }
	},

	setFormOption: function (data) {
		this.formOption = data;
	},

	getFormOption: function () {
		return this.formOption;
	},

	canShowTab: function () {
		return true;
	},
});