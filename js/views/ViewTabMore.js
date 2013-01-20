app.ViewTabMore = Backbone.View.extend({

	events: {
		'click .fauxlink.dialogTrigger' : 'showTextareaDialog',
		'click select'					: 'changeGroup',
		'blur input'					: 'addGroup',
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

	addGroup: function (event) {
		var groupName = $(event.currentTarget).val();
		this.model.setMetaTag('group', groupName);

		this.render();
	},

	changeGroup: function (event) {
		var selectedGroup = $(event.currentTarget).val();
		if (!selectedGroup) {
			
			this.model.deleteMetaTag('group');

		} else if (selectedGroup == 'new') {

			$(event.currentTarget).next('input').css('display', 'block').focus();

		} else if (selectedGroup != this.model.getMetaTag('group')) {

			this.model.setMetaTag('group', selectedGroup);

		}
	},

	showTextareaDialog: function (event) {
		var target = $(event.currentTarget);

		var view = new app.ViewDialogTextarea({model:this.model});
		view.setTitle((target.data('attribute') == 'notes') ? 'Character Notes' : 'Character Description');
		view.setField(target.data('attribute'));
		app.dispatcher.trigger('ui.show_dialog', view);
		
		event.preventDefault();
	},

	updateDescription: function () {
		if (this.model.getDescription() != '') {
			$('.description .content', this.el).html(nl2br(this.model.getDescription()));
		} else {
			$('.description .content', this.el).html('Tap to add a description.');
		}
	},

	updateNotes: function () {
		if (this.model.getNotes() != '') {
			$('.notes .content', this.el).html(nl2br(this.model.getNotes()));
		} else {
			$('.notes .content', this.el).html('Tap to add notes.');
		}
		
	},

	render: function() {

		var allGroupOptions = registry.getAllMetaTags();
		var currentGroup 	= this.model.getMetaTag('group');

		var html = '';

		html += '<div class="wrapper">';

		// description
		html += '<div class="statBlock fauxlink dialogTrigger description first" data-attribute="description">';
		html += '	<b>Description</b>';
		html += '	<div class="content">';
		if (this.model.getDescription() != '') {
			html += 	nl2br(this.model.getDescription());
		} else {
			html += 	'Tap to add a description.';
		}
		html += '	</div>';
		html += '</div>';

		// notes
		html += '<div class="statBlock fauxlink dialogTrigger notes" data-attribute="notes">';
		html += '	<b>Notes</b>';
		html += '	<div class="content">';
		if (this.model.getNotes() != '') {
			html += 	 nl2br(this.model.getNotes());
		} else {
			html += 	'Tap to add notes.';
		}
		html += '	</div>';
		html += '</div>';

		// group
		html += '<div class="statBlock groupMetaTag">';
		html += '	<b>Group</b>';
		html += '	<div class="content">';
		if (!this.model.isOwner()) {
	     	html +=		currentGroup;
	    } else {
			html += '		<select>';
			html += '		<option value="" ' + (!currentGroup ? 'selected="selected"' : '' ) + '>< None ></option>';

			for (var x in allGroupOptions) {
				html += '		<option value="' + allGroupOptions[x] + '" ' + (currentGroup == allGroupOptions[x] ? 'selected="selected"' : '' ) + '>' + allGroupOptions[x] + '</option>';
			}
			html += '		<option value="new">< New ></option>';		
			html += '		</select>';

			html += '		<input type="text" value="" style="display:none" />';
	    }
		

		html += '	</div>';		
		html += '</div>';

		// cost
		html += '<div class="statBlock last">';
		html += '	<b>Details</b>';	
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