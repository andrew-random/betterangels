app.ViewTabDialogCharacterImageSource = app.ViewTab.extend({

	events: {
		'click .fauxlink.menuItem' : 'selectImageSource',
	},

	initialize: function (options) {

		if (options && options.option) {
	      this.formOption = options.option;
	      this.formOption.on('change:value change:image_source', function () {
				this.render();
			}, this);
	    }
	},

	selectImageSource: function (e) {
		this.formOption.setImageSource($(e.target).data('imageSource'));
		e.preventDefault();
	},

	render: function() {

		var html = '';
		var imageUrl = false;
		if (this.formOption.getValue()) {
			if (this.formOption.getImageSource() == 'gallery') {
				imageUrl = 'img/characters/' + this.formOption.getValue();
			} else  {
				imageUrl = this.formOption.getValue();
			}
		}

		html +=	'<div class="currentCharacterImage">';
		html +=		'<div class="imageContainer" ' + (imageUrl ? 'style="background-image:url(' + imageUrl + ')"' : '') + '>';
		html += 	'</div>';
		html += '</div>';


		html += 	'<div class="menu">';
		var imageSources = registry.getImageSources();
		for (var sourceType in imageSources) {
			html += 	'<div class="fauxlink menuItem ' + (this.formOption.getImageSource() == sourceType ? '' : 'inactive') + '" data-image-source="' + sourceType + '">';
			html += 		imageSources[sourceType];
			html += 	'</div>';
		}
		html += 	'</div>';

		$(this.el).html(html);

		return this;    
	}

});