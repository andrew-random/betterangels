app.ModelFormOptionCharacterImage = app.ModelFormOption.extend({

	defaults: {
		value: '',
		image_source: '',
	},

	setImageSource: function (value, params) {
		return this.set('image_source', value, params);
	},

	getImageSource: function () {
		return this.get('image_source');
	},

});