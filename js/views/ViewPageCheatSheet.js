app.ViewPageCheatSheet = app.ViewPage.extend({

    className: 'page cheatSheet',

    render: function () {
      var container = $(this.el);

      var html = 'Cheat sheet';
      
      container.html(html);

      return this;
    }
});