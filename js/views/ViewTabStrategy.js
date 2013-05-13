app.ViewTabStrategy = Backbone.View.extend({

	views: [],

	className: 'ViewTabStrategy',


	close: function () {
		for (var x in this.views) {
			this.views[x].close();
		}
	},

	render: function() {
	    var container = $(this.el);
	    var primaryStrategy = this.model.getRiderStrategy();

	    var wrapper = $('<div class="wrapper"><div>');
	    container.append(wrapper);

	    var count = 0;
	    var stats = this.model.getStrategiesFormatted();
		for (var x in stats) {

			var statBlock = $('<div class="statBlock"></div>');
			if (count == 0) {
				statBlock.addClass('first');
			} else if (count + 1 == _.size(stats)) {
				statBlock.addClass('last')
			}
			count++;
			wrapper.append(statBlock);

			// first child strategy
			var tactic = stats[x].children[0];

			var view = new app.ViewTactic({model:this.model});
			view.setStatGood(tactic.good);
			view.setStatEvil(tactic.evil);
			statBlock.append(view.render().el);
			this.views.push(view);

			// parent strategy
			var view = new app.ViewTactic({model:this.model});
			view.setIsStrategy(true);
			view.setStatGood(stats[x].good);
			view.setStatEvil(stats[x].evil);
			if (primaryStrategy == stats[x].good || primaryStrategy == stats[x].evil) {
				view.setPrimaryStrategy(primaryStrategy);
			}
			statBlock.append(view.render().el);
			this.views.push(view);

			var tactic = stats[x].children[1];

			var view = new app.ViewTactic({model:this.model});
			view.setStatGood(tactic.good);
			view.setStatEvil(tactic.evil);
			statBlock.append(view.render().el);
			this.views.push(view);
/*
			// child tactics
			for (var y in stats[x].children) {

				var tactic = stats[x].children[y];

				var view = new app.ViewTactic({model:this.model});
				view.setStatGood(tactic.good);
				view.setStatEvil(tactic.evil);
				statBlock.append(view.render().el);
				this.views.push(view);
			}*/
		}
	    return this;    
	},

});