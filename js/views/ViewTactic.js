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

    className: 'tacticContainer',

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

        var goodDescription = this.model.getStatDescription(this.statGood);
        var evilDescription = this.model.getStatDescription(this.statEvil);
        var goodDice        = this.model.getNumDice(this.statGood);
        var evilDice        = this.model.getNumDice(this.statEvil);

        var html = '';

        if (this.isStrategy) {
            $(this.el).addClass('strategy');
        }
       

        html += '<div class="statLabel statEvilLabel">';
        html +=     this.statEvil + (this.primaryStrategy == this.statEvil ? '*' : '');
        if (!this.isStrategy) {
          //  html +=     '<div class="dice">' + goodDice + 'd</div>';    
        }
        if (goodDescription) {
            html +=     '<div class="description">' + goodDescription + '</div>';
        }
        html += '</div>';

        // good stat
        html += '<div class="tacticSide good">';
        html +=     '<div class="fauxlink decrement" data-action="decrement" data-stat="' + this.statGood + '">-</div>';
        html +=     '<div class="statBar"></div>';
        html +=     '<div class="fauxlink increment" data-action="increment" data-stat="' + this.statGood + '">+</div>';
        html +=     '<div class="fauxlink slide" data-action="slide" data-stat="' + this.statGood + '">&raquo; slide</div>';
        html += '</div>';

        // evil stat
        html += '<div class="tacticSide evil">';
        html +=     '<div class="fauxlink decrement" data-action="decrement" data-stat="' + this.statEvil + '">-</div>';
    
        html +=     '<div class="statBar"></div>';
        html +=     '<div class="fauxlink increment" data-action="increment" data-stat="' + this.statEvil + '">+</div>';
        html +=     '<div class="fauxlink slide" data-action="slide" data-stat="' + this.statEvil + '">slide &laquo;</div>';
        html += '</div>';        

        html += '<div class="statLabel statGoodLabel">';
        if (evilDescription) {
            html +=     '<div class="description">' + evilDescription + '</div>';    
        }
        if (!this.isStrategy) {
         //   html +=     '<div class="dice">' + evilDice + 'd</div>';    
        }
        html +=     this.statGood + (this.primaryStrategy == this.statGood ? '*' : '');
        html += '</div>';

        $(this.el).html(html);

        // place dots
        this.updateStatBars();

        return this;    
    }

});