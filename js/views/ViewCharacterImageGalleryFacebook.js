app.ViewCharacterImageGalleryFacebook = app.ViewTab.extend({

	selectedAlbum 	: false,
	albumData 		: null,
	albumDetails 	: null,

	events: {	
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

		app.user.getFacebookAlbumDataById(
			
			this.selectedAlbum, 

			_.bind(function (albumDetails) {
				this.albumDetails = albumDetails;
				this.render();
			}, this),

			_.bind(function (ajaxResp) {
				//if (ajaxResp.statusText == 'Bad Request') {
					$('.loading', this.el).replaceWith('<span class="info error">Facebook did not return the requested Album.<br />There may be a permissions issue.</span>');
					$('.facebookPhotoContainer').append('<div class="fauxlink back">&laquo; Go Back</div>');
				//}
			}, this)
		);

		event.preventDefault();
	},

	selectPhoto: function (event) {
		var target = $(event.currentTarget);
		this.formOption.setValue(app.fbGetPhotoUrl(target.data('photoId'), 'thumbnail'));

		event.preventDefault();
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
	    
	    html += '<div class="facebookPhotoContainer">';

	    if (this.albumData === null) {
			html += '<div class="loading">Loading</div>';
	    } else {
	    	if (!this.selectedAlbum) {

	    		html += "<div class='info'>Only albums with expanded permissions are available from FB.</div>";
				for (var x in this.albumData) {
					//if (this.albumData[x].privacy == 'friends-of-friends') {
			    		html += '<div class="fauxlink album clear-block" data-album-id="' + this.albumData[x].id + '">';
			    		html += 	'<img src="' + app.fbGetPhotoUrl(this.albumData[x].cover_photo, 'thumbnail') + '" />';
			    		html += '		<div class="name">';
			    		html += '		' + this.albumData[x].name;
			    		html += '		<div class="privacy">' + this.albumData[x].privacy + '</div>';
			    		html += '	</div>';
			    		html += '</div>';
					//}
					
		    	}
	    	} else {
	    	
			   	html += '<div class="fauxlink back">&laquo; Go Back</div>';
	    		html += "<div class='info'>" + this.albumDetails.length + " images found in gallery.</div>";

	    		html += '<div class="imageGallery">';
	    		for (var x in this.albumDetails) {
	    			html += '<img src="' + app.fbGetPhotoUrl(this.albumDetails[x].id, 'thumbnail') + '" class="fauxlink photo ' + (this.formOption.getValue() == this.albumDetails[x].id ? 'selected' : '') + '" data-photo-id="' + this.albumDetails[x].id + '" />';
	    		}
	    		html += '</div>';
	       	}	
	    }
	    html += '</div>';

	   	container.html(html);


	    return this;    
	},	
});