app.ViewDialogSpecialties = app.ViewDialog.extend({

	events: {	
		'click .done' 		: 'commitChange',
		'blur input'		: 'textboxInput',
	},

	specialties: {0:'', 1:'', 2:''},

	className: 'ViewDialogSpecialties',

	title: 'Choose Specialties',

	textboxInput: function (event) {
		var target = $(event.currentTarget);
		this.specialties[parseInt(target.data('slot'))] = target.val();
	},

	commitChange: function () {

		for (var slot in this.specialties) {
			this.model.removeSpecialtyBySlot(slot);
			if (this.specialties[slot].length > 0) {
				this.model.addSpecialty(slot, this.specialties[slot]);	
			}
			
		}

		if (!this.model.isOwner()) {
            app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
        } else {
        	this.hide();
        }
	},

	render: function() {

	    var container 		= $(this.el);
	  	var specialties 	= this.model.getSpecialties();
	    var html = '';
	   	var count = 0;

		var html = '';	   	
	    html += '<div class="specialtyContent">';
	    html += '	<p>Specialties are for things that most people don\'t even know enough to attempt. Nobody\'s going to defuse an A-bomb, pilot a B-52, translate hieroglyphics or perform an appendectomy without training.</p>';
	    html += '	<p>You can have up to 3 specialties.<p>';
	    html += '</div>';
	    for (var x in specialties) {
	    	html += this.renderFormElement(x, specialties[x]);
	    	count++;
	    }
	    while (count < 3) {
	    	html += this.renderFormElement(count, '');
	    	count++;
	    }
	   
	   	html += '<div class="controls one_button">';
	   	html += '	<div class="fauxlink done">Done</div>';
	   	html += '</div>';

	   	container.html(html);


	    return this;    
	},

	renderFormElement: function (slot, defaultValue) {
		var html = '';
		html += '<div class="formElement clear-block">';
	    html += '<div class="formElementLabel">Specialty #' + (slot + 1) + '</div>';
	    html += '<input type="text" value="' + defaultValue + '" data-slot="' + slot + '" />';
		html += '</div>';
		return html;
	},

});