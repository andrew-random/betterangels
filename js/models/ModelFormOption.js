app.ModelFormOption = Backbone.Model.extend({

	defaults: {
		value: '',
	},

	setValue: function (data, params) {
		return this.set('value', data, params);
	},

	getValue: function () {
		return this.get('value');
	},
});