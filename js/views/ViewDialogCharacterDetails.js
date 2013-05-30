app.ViewDialogCharacterDetails = app.ViewDialog.extend({

	events: {	
		'click .done' 					: 'hide',
		'blur input[@type="text"]'		: 'textInput',
		'click .radioButton'			: 'radioButton',
		'click select'					: 'selectInput',
		'change select'					: 'selectInput'
	},

	title: 'Edit Character',

	selectInput: function (event) {
		var target =  $(event.currentTarget);
		this.model.setRiderStrategy(target.val());

		if (!this.model.isOwner()) {
            app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
		}
	},

	textInput: function (event) {
		var target =  $(event.currentTarget);
		var self 	= this;	// scope hack

		target.data('timeout', setTimeout(function () {
			switch (target.data('attribute')) {
				case 'character_name':
					self.model.setCharacterName(target.val());
					break;

				case 'stage_name':
					self.model.setStageName(target.val());
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
			$('input[data-attribute="player_name"]', this.el).prop('disabled', 'disabled');
		}
		$('.formElementLabel[data-attribute=stage_name]', this.el).text((this.model.isDemon() ? 'Villain Name' : 'Hero Name'));
		$('.formElementLabel[data-attribute=rider_name]', this.el).text((this.model.isDemon() ? 'Demon Name' : 'Angel Name'));

		var self = this; // scope hack
		$('.radioButton', this.el).each(function () {
			$(this).removeClass('selected');
			if ($(this).data('attribute') == 'is_angel' && self.model.getCharacterType() == 'angel') {
				$(this).addClass('selected');
			} else if ($(this).data('attribute') == 'is_demon' && self.model.getCharacterType() == 'demon') {
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

	    html += '<div class="formElement">';
	    html += '	<div class="formElementLabel" data-attribute="stage_name">' + (this.model.isDemon() ? 'Villain Name' : 'Hero Name') + '</div>';
	    html += '	<input type="text" tabindex="0" value="' + this.model.getStageName() + '" data-attribute="stage_name" />';
	    html += '</div>';

		html += '<div class="formElement clear-block">';
	    html += 	'<div class="formElementLabel">Host</div>';
	    html += 	'<input type="text" value="' + this.model.getCharacterName() + '" data-attribute="character_name" />';
		html += '</div>';

		html += '<div class="formElement clear-block">';
	    html += 	'<div class="formElementLabel" data-attribute="rider_name">' + (this.model.isDemon() ? 'Demon' : 'Angel') + '</div>';
	    html += 	'<input type="text" value="' + this.model.getRiderName() + '" data-attribute="rider_name" />';
		html += '</div>';
	
		html += '<div class="formElement clear-block">';
	    html += 	'<div data-attribute="is_demon" class="fauxlink radioButton ' + (this.model.getCharacterType() == 'demon' ? 'selected':'') + '">Demon</div>';
	   	html += 	'<div data-attribute="is_angel" class="fauxlink radioButton ' + (this.model.getCharacterType() == 'angel' ? 'selected':'') + '">Angel</div>';
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
		html += '<div class="formElementLabel">Player</div>';		
	    html += '<input type="text" value="' + this.model.getPlayerName() + '" data-attribute="player_name" />';
		html += '</div>';


	   	html += '<div class="controls one_button">';
	   	html += '	<div class="done">Done</div>';
	   	html += '</div>';

	   	container.html(html);

	    return this;    
	},

});