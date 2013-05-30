app.ViewTabDialogCharacterImageGallery = app.ViewTab.extend({

	galleryView: false,

	initialize: function (options) {

		if (options && options.option) {
	      this.formOption = options.option;
	      this.formOption.on('change', function () {
			this.render();
			}, this);
	    }
	},

	canShowTab: function () {
		return this.formOption.getImageSource();
	},

	onClose: function () {
		if (this.galleryView) {
			this.galleryView.close();
			this.galleryView = false;
		}
	},

	render: function() {
		switch (this.formOption.getImageSource()) {
			case 'gallery':
				this.galleryView = new app.ViewCharacterImageGalleryLocal({model:this.model, option:this.formOption});
				break;
			case 'facebook':
				this.galleryView = new app.ViewCharacterImageGalleryFacebook({model:this.model, option:this.formOption});
				break;
		}

		if (this.galleryView) {
			console.log('rendering' + this.formOption.getImageSource());
			$(this.el).html(this.galleryView.render().el);
		}
	

	    return this;
	},	
});