app.ViewTactic = Backbone.View.extend({

    defaults: {
        'statGood'          : null,
        'statEvil'          : null,
        'isStrategy'        : false,
        'primaryStrategy'   : false,
    },

    events: {
        'click .fauxlink': 'clickStatButton',
    },

    clickStatButton: function (event) {

        var data = $(event.currentTarget).data();
        switch (data.action) {
            case 'slide':
                this.model.slideStatValue(data.stat);
                break;

            case 'increment':
                this.model.incrementStatValue(data.stat);
                break;

            case 'decrement':
                this.model.decrementStatValue(data.stat);
                break;
        }

        if (!this.model.isOwner()) {
            
            app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));

        }
        event.preventDefault();
    },

	initialize: function () {
		this.model.on('stat_change', this.checkUpdate, this);
        this.model.on('change change:rider_strategy', this.checkUpdate, this);
	},

    checkUpdate: function (updatedStat) {
        if (updatedStat == this.statGood || updatedStat == this.statEvil) {
           this.updateStatBars();
        }
        if (this.model.hasChanged('rider_strategy')) {
            var riderStrategy = this.model.get('rider_strategy');
            if (riderStrategy == this.statGood || riderStrategy == this.statEvil) {
                this.setPrimaryStrategy(riderStrategy);
                this.render();
            } else if (this.primaryStrategy != riderStrategy) {
                this.setPrimaryStrategy(false);
                this.render();
            }
        }
        return true;
    },

    setStatGood: function (value) {
        this.statGood = value;
    },

    setStatEvil: function (value) {
        this.statEvil = value;
    },

    setIsStrategy: function (value) {
        this.isStrategy = value;
    },

    setPrimaryStrategy: function (value) {
        this.primaryStrategy = value;
    },

    updateStatBars: function () {
        var statGoodValue = this.model.getStatValue(this.statGood);
        var statEvilValue = this.model.getStatValue(this.statEvil);

        var html = '';
        for (var x = 1; x <= 5; x++) {
            if (x <= statEvilValue) {
                html += '<div class="dotEvil"></div>';
            } else {
                html += '<div class="dotEmpty"></div>';
            }
        }
        $('.tacticSide.evil .statBar', this.el).html(html);

         var html = '';
        for (var x = 5; x >= 1; x--) {
            if (x <= statGoodValue) {
               html += '<div class="dotGood"></div>';
            } else {
                html += '<div class="dotEmpty"></div>';
            }
        }
        $('.tacticSide.good .statBar', this.el).html(html);
    },

    render: function() {        

        var html = '';
       
        html += '<div class="tacticContainer ' + (this.isStrategy ? 'strategy' : '') + '">';
        html += '   <div class="statGoodLabel">' + this.statGood + (this.primaryStrategy == this.statGood ? '*' : '') + '</div>';
        html += '   <div class="statEvilLabel">' + this.statEvil + (this.primaryStrategy == this.statEvil ? '*' : '') + '</div>';

        // evil stat
        html += '   <div class="tacticSide evil">';
        html += '       <div class="fauxlink decrement" data-action="decrement" data-stat="' + this.statEvil + '">-</div>';
       
        html += '       <div class="statBar">';
        //html += '          <div class="stat" style="width:' + ((statEvilValue / 5) * 100) + '%"></div>';
        html += '       </div>';
        html += '       <div class="fauxlink increment" data-action="increment" data-stat="' + this.statEvil + '">+</div>';
        html += '       <div class="fauxlink slide" data-action="slide" data-stat="' + this.statEvil + '">slide &raquo;</div>';
        html += '   </div>';

        // good stat
        html += '   <div class="tacticSide good">';
        html += '       <div class="fauxlink decrement" data-action="decrement" data-stat="' + this.statGood + '">-</div>';
        html += '       <div class="statBar">';
        //html += '         <div class="stat" style="width:' + ((statGoodValue / 5 ) * 100) + '%"></div>';
       
        html += '       </div>';
        html += '       <div class="fauxlink increment" data-action="increment" data-stat="' + this.statGood + '">+</div>';
        html += '       <div class="fauxlink slide" data-action="slide" data-stat="' + this.statGood + '">&laquo; slide</div>';
        html += '   </div>';

        html += '</div>';

        $(this.el).html(html);

        // place dots
        this.updateStatBars();

        return this;    
    }

});