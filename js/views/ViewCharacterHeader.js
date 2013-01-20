app.ViewCharacterHeader = Backbone.View.extend({

    className: 'characterHeader',

	initialize: function () {
		this.model.on('change', this.render, this);
	},

    events: {
        'mouseup .boundingBox' : 'showCharacterDetails',
        'click .image' : 'showImageDetails'
    },

    showCharacterDetails: function (event) {

        var view = new app.ViewDialogCharacterDetails({model:this.model});

        app.dispatcher.trigger('ui.show_dialog', view);

        event.preventDefault();
    },

    showImageDetails: function (event) {

        var view = new app.ViewDialogCharacterImage({model:this.model});

        app.dispatcher.trigger('ui.show_dialog', view);

        event.preventDefault();
    },
    
    render: function() {

        var html = '';
        var imageStyle = '';
        var playerName = (this.model.getPlayerName() ? this.model.getPlayerName() : 'Player Name');

        // override npc name
        if (this.model.getIsNpc()) {
            playerName = 'NPC';
        }


        // a smaller bounding box than the actual div element
        html += '<div class="fauxlink boundingBox"></div>';

        var imageStyle = '';
        if (this.model.hasImageUrl()) {
            imageStyle = 'style="background-image:url(' + this.model.getImageUrl() + ');"';
        }
        html += '<div class="fauxlink image" ' + imageStyle + '></div>';

        html += '<h1>' + (this.model.getRiderName() ? this.model.getRiderName() : 'Rider Name') + '</h1>';
        html += '<h2>' + (this.model.getCharacterName() ? this.model.getCharacterName() : 'Character Name') + '</h2>';
        html += '<h3>' + playerName + '</h3>';

        $(this.el).html(html);

        if (this.model.getCharacterType() == 'angel') {
        	$(this.el).addClass('angel');
        	$(this.el).removeClass('demon');
        } else {
        	$(this.el).addClass('demon');
        	$(this.el).removeClass('angel');
        }

        return this;    
    }

});