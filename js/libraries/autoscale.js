AutoScale = function(dom_element) {
    var self = this;
    
    this.dom_element = dom_element;
    
    var style = dom_element.style;

    var transform_property = (style.TransitionDuration === '' && 'Transform');
    transform_property = transform_property || (style.MozTransitionDuration === '' && 'MozTransform');
    transform_property = transform_property || (style.WebkitTransitionDuration === '' && 'WebkitTransform');
    transform_property = transform_property || (style.OTransitionDuration === '' && 'OTransform');
    transform_property = transform_property || (style.MsTransitionDuration === '' && 'MsTransform');

    this.transform_property = transform_property;

    jQuery(window).bind('resize', function() {
        self.refresh();
    });
    this.refresh();
};

AutoScale.prototype.refresh = function() {
    this.dom_element.style[this.transform_property] = 'scale(0.1)';
    var max_scale = Math.min((jQuery(window).height()/320), jQuery(window).width()/480);
    this.dom_element.style[this.transform_property] = 'scale(' + max_scale + ')';
};