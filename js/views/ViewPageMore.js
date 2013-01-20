app.ViewPageMore = app.ViewPage.extend({

    className: 'page more',

    render: function () {
      var container = $(this.el);

      var html = 'More info';
      
      container.html(html);

      return this;
    }
});