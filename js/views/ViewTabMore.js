app.ViewTabMore = Backbone.View.extend({

	events: {
		'click .fauxlink.dialogTrigger' : 'showTextareaDialog',
		'click .fauxlink.metaTag' 		: 'showEditOptions',
		'click input[@type="radio"]'	: 'changeGroup',
		'click input[@type="button"]'	: 'addNewMetaTag',
	},

	className: 'ViewTabMore',

	initialize: function () {
	    this.model.on('change change:specialties', this.updateDotCost, this);
	    this.model.on('change change:description', this.updateDescription, this);
	    this.model.on('change change:notes', this.updateNotes, this);
	},

	updateDotCost: function () {
		$('.cost span', this.el).text(this.model.getTotalCost());
	},

	addNewMetaTag: function (event) {

		var groupName = $('input[name="metaTagNew"]', this.el).val();
		if (groupName && groupName != '' && groupName != this.model.getMetaTag('group')) {
			this.model.setMetaTag('group', groupName);
			this.render();
		}
	},

	changeGroup: function (event) {
		console.log('change', this.model.toJSON());
		var selectedGroup = $(event.currentTarget).val();

		if (!selectedGroup) {
			
			this.model.deleteMetaTag('group');

		} else if (selectedGroup != this.model.getMetaTag('group')) {

			this.model.setMetaTag('group', selectedGroup);

			$('label').removeClass('active');

			$('label input').each(function () {
				if ($(this).val() == selectedGroup) {
					$(this).prop({'checked':'checked'});
					$(this).parents('label').addClass('active');
				}
			});
		}
	},

	showTextareaDialog: function (event) {

		if (!this.model.isOwner()) {
	      app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
	    } else {
	      var target = $(event.currentTarget);

		  var view = new app.ViewDialogTextarea({model:this.model});
		  view.setTitle((target.data('attribute') == 'notes') ? 'Character Notes' : 'Character Description');
		  view.setField(target.data('attribute'));
		  app.dispatcher.trigger('ui.show_dialog', view);
	    }
		
		event.preventDefault();
	},

	updateDescription: function () {
		if (this.model.getDescription() != '') {
			$('.description .content', this.el).html(nl2br(this.model.getDescription()));
		} else {
			$('.description .content', this.el).html('No description provided.');
		}
	},

	updateNotes: function () {
		if (this.model.getNotes() != '') {
			$('.notes .content', this.el).html(nl2br(this.model.getNotes()));
		} else {
			$('.notes .content', this.el).html('No notes provided.');
		}
		
	},

	showEditOptions: function (event) {

		if (!this.model.isOwner()) {
	      app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
	    } else {
	      $(event.target).parents('.statBlock').toggleClass('editMode');  
	    }

    	event.preventDefault();
	},

	render: function() {

		var allGroupOptions = registry.getAllMetaTags();
		var currentGroup 	= this.model.getMetaTag('group');

		var html = '';

		html += '<div class="wrapper">';

		// description
		html += '<div class="statBlock description first">';
		html += '	<div class="statBlockTitle">Description<div class="fauxlink statBlockEdit dialogTrigger" data-attribute="description">Edit</div></div>';
		html += '	<div class="content">';
		if (this.model.getDescription() != '' && this.model.getDescription() !== null) {
			html += 	nl2br(this.model.getDescription());
		} else {
			html += 	'No description provided.';
		}
		html += '	</div>';
		html += '</div>';

		// notes
		html += '<div class="statBlock notes">';
		html += '	<div class="statBlockTitle">Notes<div class="fauxlink statBlockEdit dialogTrigger" data-attribute="notes">Edit</div></div>';
		html += '	<div class="content">';
		if (this.model.getNotes() != '' && this.model.getNotes() !== null) {
			html += 	 nl2br(this.model.getNotes());
		} else {
			html += 	'No notes provided.';
		}
		html += '	</div>';
		html += '</div>';

		// group
		html += '<div class="statBlock groupMetaTag">';
		html += '	<div class="statBlockTitle">Group<div class="fauxlink statBlockEdit metaTag" data-attribute="metaTag">Edit</div></div>';
		html += '	<div class="content">';
		
		html += '		<div class="clear-block">';
		for (var x in allGroupOptions) {
			html += '		<label ' + (currentGroup == allGroupOptions[x] ? 'class="active"' : '' ) + '>';
			html += '			<input name="metaTag" type="radio" value="' + allGroupOptions[x] + '" ' + (currentGroup == allGroupOptions[x] ? 'checked="checked"' : '' ) + ' />';
			html += '			<span>' + allGroupOptions[x] + '</span>';
			html += '		</label>';
		}
		html += '			<label ' + (!currentGroup ? 'class="active"' : '' ) + '><input name="metaTag" type="radio" value="" ' + (!currentGroup ? 'checked="checked"' : '' ) + ' />None</label>';
		html += '		</div>';
		
		html += '		<div class="newMetaTag"><input type="text" name="metaTagNew" value="" /> <input class="addNewMetaTag" type="button" value="Add New" /></div>';
		

		html += '	</div>';		
		html += '</div>';

		// cost
		html += '<div class="statBlock last">';
		html += '	<div class="statBlockTitle">Details</div>';
		html += '	<div class="content">';
		html += '		<div class="cost">Total Dot Cost: <span>' + this.model.getTotalCost() + '</span></div>';
		html += '		<div class="created">Created: ' + this.model.getCreatedDateFormatted() + '</div>';
		html += '		<div class="updated">Last modified: ' + this.model.getLastModifiedDateFormatted() + '</div>';
		html += '	</div>';		
		html += '</div>';		

		html += '</div>';

		$(this.el).html(html);

		return this;    
	}

});