app.ViewDialogCharacterDetails = app.ViewDialog.extend({

	events: {	
		'click .done' 					: 'hide',
		'blur input[@type="text"]'		: 'textInput',
		'click .radioButton'			: 'radioButton',
		'click select'					: 'selectInput',
		'change select'					: 'selectInput'
	},


	selectInput: function (event) {
		var target =  $(event.currentTarget);
		this.model.setRiderStrategy(target.val());

		if (!this.model.isOwner()) {
            app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
		}
	},

	textInput: function (event) {
		var target =  $(event.currentTarget);
		var self = this;	// scope hack

		target.data('timeout', setTimeout(function () {
			switch (target.data('attribute')) {
				case 'character_name':
					self.model.setCharacterName(target.val());
					break;	

				case 'player_name':
					self.model.setPlayerName(target.val());
					break;

				case 'rider_name':
					self.model.setRiderName(target.val());
					break;
			}
		}, 100));

		if (!this.model.isOwner()) {
            app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
		}

	},

	radioButton: function (event) {
		var target =  $(event.currentTarget);


		if (target.data('attribute') == 'is_angel') {
			this.model.setCharacterType('angel');
		} else if (target.data('attribute') == 'is_demon') {
			this.model.setCharacterType('demon');
		} else {
			if (this.model.getIsNpc()) {

				this.model.setIsNpc(false);
				$('input[data-attribute="player_name"]', this.el).prop('disabled', '').focus();

			} else {
				
				this.model.setIsNpc(true);
				$('input[data-attribute="player_name"]', this.el).prop('disabled', 'disabled');

			}
		}

		var self = this; // scope hack
		$('.radioButton', this.el).each(function () {
			$(this).removeClass('selected');
			if ($(this).data('attribute') == 'is_angel' && self.model.getCharacterType() == 'angel') {
				$(this).addClass('selected');
			} else if ($(this).data('attribute') == 'is_demon' && self.model.getCharacterType() == 'demon') {
				$(this).addClass('selected');
			} else if ($(this).data('attribute') == 'is_npc' && self.model.getIsNpc()) {
				$(this).addClass('selected');
			}
		});

		if (!this.model.isOwner()) {
            app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
		}

		event.preventDefault();

	},

	render: function() {

	    var container 		= $(this.el);
	    var strategies 		= this.model.getStrategiesFormatted();
	    var riderStrategy 	= this.model.getRiderStrategy();

	    var html = '';

	    html += '<h1>Character detail</h1>';

		html += '<div class="formElement clear-block">';
	    html += '<div class="formElementLabel">Rider Name</div>';

	    html += '<input type="text" value="' + this.model.getRiderName() + '" data-attribute="rider_name" />';
	    html += '	<div data-attribute="is_demon" class="fauxlink radioButton ' + (this.model.getCharacterType() == 'demon' ? 'selected':'') + '""> Is Demon</div>';
	   	html += '	<div data-attribute="is_angel" class="fauxlink radioButton ' + (this.model.getCharacterType() == 'angel' ? 'selected':'') + '""> Is Angel</div>';
		html += '</div>';

	    html += '<div class="formElement">';
	    html += '<div class="formElementLabel">Human Name</div>';
	    html += '<input type="text" tabindex="0" value="' + this.model.getCharacterName() + '" data-attribute="character_name" />';
	    html += '</div>';
	    

		html += '<div class="formElement clear-block">';
	    html += '<div class="formElementLabel">Rider Primary Strategy</div>';		
	    html += '<select>';
	    html += '<option value="">- None -</option>';
	    html += '<optgroup label="Angel"></optgroup>';
	    for (var x in strategies) {
	    	html += '<option value="' + strategies[x].good + '" ' + (riderStrategy == strategies[x].good ? ' selected="selected"' : '') + '>' + strategies[x].good + '</option>';
	    }
	    html += '<optgroup label="Demon"></optgroup>';
	    for (var x in strategies) {
	    	html += '<option value="' + strategies[x].evil + '" ' + (riderStrategy == strategies[x].evil ? ' selected="selected"' : '') + '>' + strategies[x].evil + '</option>';
	    }
	    html += '</select>';
		html += '</div>';

		html += '<div class="formElement clear-block">';
		html += '<div class="formElementLabel">Player Name</div>';		
	    html += '<input type="text" value="' + this.model.getPlayerName() + '" ' + (this.model.getIsNpc() ? 'disabled=disabled':'') + ' data-attribute="player_name" />';
	    html += '	<div data-attribute="is_npc" class="fauxlink radioButton ' + (this.model.getIsNpc() ? 'selected':'') + '"> Is NPC</div>';
		html += '</div>';


	   	html += '<div class="controls one_button">';
	   	html += '	<div class="done">Done</div>';
	   	html += '</div>';

	   	container.html(html);

	    return this;    
	},

});