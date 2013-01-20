// Facebook user model
app.ModelUser = Backbone.Model.extend({

	isLoaded 	: false,
	albums 		: null,
	albumDetails: {},

	defaults: {
		'name'				: null, // string	Name of this ability
		'fb_user_id'		: null, // string 	Facebook unique id
		'timezone'			: null,	// int		User Timezone
		'gender'			: null, // string	User Gender
		//whatever other properties are required
	},

	isAnon: function () {
		return (this.get('fb_user_id') === null);
	},

	getName: function () {
		return this.get('name');
	},

	getFacebookId: function () {
		return this.get('fb_user_id');
	},

	getProfilePic: function () {
		return this.get('profile_pic');
	},

	isLoaded: function () {
		return this.getFacebookId() != null;
	},

	getFacebookAlbums: function (successCallback, errorCallback) {
		if (this.albums === null) {
			app.fbGetGraph('me/albums', _.bind(function (resp) {
				
				// set cached data
				this.albums = resp.data;

				// trigger callback
				if (successCallback) {
					successCallback(this.albums);
				}
			}, this));
		} else {
			successCallback(this.albums);
		}
	},

	getFacebookAlbumDataById: function (albumId, successCallback, errorCallback) {
		if (typeof this.albumDetails[albumId] == 'undefined') {
			app.fbGetGraph(albumId + '/photos', _.bind(function (resp) {
				
				// set cached data
				this.albumDetails[albumId] = resp.data;

				// trigger callback
				if (successCallback) {
					successCallback(this.albumDetails[albumId]);
				}
			}, this));
		} else {
			successCallback(this.albumDetails[albumId]);
		}
	},

});