app.ViewCharacterImageGalleryLocal = app.ViewTab.extend({

	events: {	
		'click .fauxlink.photo'			: 'selectPhoto',
	},

	selectPhoto: function (event) {

		var target = $(event.currentTarget);
		this.formOption.setValue(target.data('image'));

		console.log('local', this.formOption.toJSON(), target.data('image'));

		event.preventDefault();
	},

	render: function() {
		
		var container = $(this.el);

		var html = '';
		var gallery = registry.getLocalGalleryImages();
		html += '<div class="imageGallery">';
		for (var x in gallery) {
			html += '<img src="img/characters/' + gallery[x] + '" class="fauxlink photo ' + (this.formOption.getValue() == gallery[x] ? 'selected' : '') + '" data-image="' + gallery[x] + '" />';
		}
		html += '</div>';
	   	container.html(html);


	    return this;    
	},	
});