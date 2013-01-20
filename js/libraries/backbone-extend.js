/**
	Garbage collection function for views
	Removes a view's element from the DOM, destorying any event listeners contained within the view
	Unbinds any triggers the view has
	If the view has defined a "onClose" function, it will also be executed
	
	@return	this
*/
Backbone.View.prototype.close = function() {

	// generic close event for all views
	this.trigger("close", this);
	
	// standard garbage collection
	this.remove();
	this.unbind();
	
	// if an onclose function is defined, call
	if (!_.isUndefined(this.onClose)) {
		this.onClose();
	}
			
	// return
	return this;

}