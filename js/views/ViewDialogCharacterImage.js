app.ViewDialogCharacterImage = app.ViewDialog.extend({

	title: 'Select an Image',

	selectedAlbum 	: false,
	albumData 		: null,
	albumDetails 	: null,

	dialogSize: app.ViewDialog.DialogSizeDefault,

	events: {	
		'click .done' 					: 'hide',
		'click .back' 					: 'backToTop',
		'click .fauxlink.album'			: 'selectAlbum',
		'click .fauxlink.photo'			: 'selectPhoto',
	},

	backToTop: function () {
		this.selectedAlbum = null;
		this.render();
	},

	selectAlbum: function (event) {
		var target = $(event.currentTarget);
		this.selectedAlbum = target.data('albumId');

		$('.facebookPhotoContainer', this.el).html('<div class="loading">Loading</div>');

		app.user.getFacebookAlbumDataById(this.selectedAlbum, _.bind(function (albumDetails) {
			this.albumDetails = albumDetails;
			this.render();
		}, this));

		event.preventDefault();
	},

	selectPhoto: function (event) {
		var target = $(event.currentTarget);
		this.model.setImageUrl(app.fbGetPhotoUrl(target.data('photoId'), 'thumbnail'));

		event.preventDefault();

		this.hide();
	},

	render: function() {

		// queue re-load if no album data is found
		if (this.albumData === null) {
			app.user.getFacebookAlbums(_.bind(function (albumData) {
				this.albumData = albumData;
				this.render();
			}, this));	
		}

	    var container 		= $(this.el);
	  
	    var html = '';

	    html += '	<h1>' + this.title + '</h1>';
	    
	    html += '<div class="facebookPhotoContainer">';

	    if (this.albumData === null) {
			html += '<div class="loading">Loading</div>';
	    } else {
	    	if (!this.selectedAlbum) {

	    		html += "<div class='info'>Only albums with friends-of-friends permissions are available from FB.</div>";
				for (var x in this.albumData) {
					if (this.albumData[x].privacy == 'friends-of-friends') {
			    		html += '<div class="fauxlink album" data-album-id="' + this.albumData[x].id + '">';
			    		html += 	'<img src="' + app.fbGetPhotoUrl(this.albumData[x].cover_photo, 'thumbnail') + '" />';
			    		html += '	' + this.albumData[x].name;
			    		html += '</div>';
					}
					
		    	}
	    	} else {
	    		for (var x in this.albumDetails) {
	    			html += '<div class="fauxlink photo" data-photo-id="' + this.albumDetails[x].id + '">';
	    			html += 	'<img src="' + app.fbGetPhotoUrl(this.albumDetails[x].id, 'thumbnail') + '" />';
	    			html += '</div>';
	    		}
	       	}	
	    }
	    html += '</div>';

	    if (!this.selectedAlbum) {
		    html += '<div class="controls one_button">';
		   	html += '	<div class="fauxlink done">Done</div>';
		   	html += '</div>';	
	    } else {
	    	html += '<div class="controls two_buttons">';
	    	html += '	<div class="fauxlink cancel back">Back</div>';
		   	html += '	<div class="fauxlink done">Done</div>';
		   	html += '</div>';	
	    }
	   	

	   	container.html(html);


	    return this;    
	},	
});