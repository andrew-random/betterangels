app.ViewDialogCharacterImage = app.ViewDialog.extend({

	title: 'Select an Image',

	events: {
		'click .fauxlink.cancel' 	: 'hide',
		'click .fauxlink.save' 		: 'save',
	},

	initialize: function (options) {

		this.formOption = new app.ModelFormOptionCharacterImage();

		// add tabs
		this.tabView = new app.ViewSequentialTabs();
		this.tabView.addTab('source', 'Source', new app.ViewTabDialogCharacterImageSource({model:this.model, option:this.formOption}));
		this.tabView.addTab('gallery', 'Gallery', new app.ViewTabDialogCharacterImageGallery({model:this.model, option:this.formOption}));

		this.tabView.setChangeLocationOnClick(false);

		// set the default
		this.tabView.setActiveTab('source');

		this.formOption.on('change', function () {
			console.log('change check', this.formOption.hasChanged('image_source'), this.formOption.hasChanged('value'));
			if (this.formOption.hasChanged('image_source')) {
				console.log('source change');
				// changing the source means that the image must be invalid.
				//this.formOption.setValue(false, {silent:true});

				this.tabView.updateTabRow();
				this.tabView.showTab('gallery', true);
			} else {

				console.log('image change');
				this.tabView.updateTabRow();
				if (this.formOption.getValue()) {
					this.tabView.showTab('source', true);
				}
			}
			

			
		}, this);

		this.formOption.on('change:value', function () {
			
			
		}, this);

	},

	save: function () {
		if (this.formOption.getValue()) {
			this.model.setImageType(this.formOption.getImageSource());		
			this.model.setImageUrl(this.formOption.getValue());	
		}
		this.hide();
	},

	setImageUrl: function (value) {
		this.formOption.setValue(value, {silent:true});
	},
	getImageUrl: function () {
		return this.formOption.getValue();
	},

	setImageType: function (value) {
		this.formOption.setImageSource(value, {silent:true});
	},
	getImageType: function () {
		return this.formOption.getImageSource();
	},

	render: function() {

		$(this.el).html(this.tabView.render().el);

		var html = '';
		html += '<div class="controls two_buttons">';
	   	html += '	<div class="fauxlink cancel">Cancel</div>';
	   	html += '	<div class="fauxlink save">Select</div>';
	   	html += '</div>';
		$(this.el).append(html);

	    return this;    
	},
});