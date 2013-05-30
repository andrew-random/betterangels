app.ViewDialogPHPMessage = app.ViewDialog.extend({

	className : 'ViewDialogPHPMessage',

	title: '',
	body: '',
	type: '',
	dialogSize: '',

 	events: {
      'click .done'  : 'hide', 
    },

    initialize: function (options) {
    	this.title = options.title;
    	this.body = options.body;
    	this.type = options.type;
    	if (options.size) {
    		this.dialogSize = options.size;	
    	}
    	
    },

	render: function () {

		var html = '';
		html += '<div class="body">' + this.body + '</div>';

		html += '<div class="controls one_button">';
	   	html += '	<div class="fauxlink done">Done</div>';
	   	html += '</div>'

		$(this.el).html(html).prop('className', this.className + ' ' + this.type);

		return this;
	}

});