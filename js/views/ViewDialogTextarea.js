app.ViewDialogTextarea = app.ViewDialog.extend({

	events: {	
		'click .done' 		: 'commitChange',
		'blur textarea'		: 'textareaInput',
	},

	textContent: null,

	title: null,
	field: null,

	className: 'ViewDialogTextarea',

	textareaInput: function (event) {
		var target = $(event.currentTarget);
		if (target.val() !== null && this.textContent != target.val()) {
			this.textContent = target.val();
		}
	},

	setTitle: function (value) {
		this.title = value;
	},

	setField: function (value) {
		this.field = value;
	},

	commitChange: function () {
		var hasChanged = false;
		if (this.field == 'description') {
			if (this.textContent != this.model.getDescription()) {
				this.model.setDescription(this.textContent);
				hasChanged = true;
			}
		} else {
			if (this.textContent != this.model.getNotes()) {
				this.model.setNotes(this.textContent);
				hasChanged = true;
			}
		}

		if (hasChanged && !this.model.isOwner()) {
            app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
		} else {
			this.hide();	
		}
		
	},

	render: function() {

	    var container 		= $(this.el);
	  
	  	if (this.field == 'notes') {
			this.textContent = this.model.getNotes();
		} else {
			this.textContent = this.model.getDescription();
		}

	    var html = '';

	    html += '	<h1>' + this.title + '</h1>';
	    html += '		<div class="textareaWrapper">';
		html += '		<textarea>' + this.textContent + '</textarea>';
		html += '	</div>';

	   	html += '<div class="controls one_button">';
	   	html += '	<div class="fauxlink done">Done</div>';
	   	html += '</div>';

	   	container.html(html);


	    return this;    
	},

});