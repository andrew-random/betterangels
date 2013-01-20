app.ViewPageHome = app.ViewPage.extend({

    loginButtonView: null,

    events: {
      'click .menuItem'       : 'changePage',
    },

    initialize: function () {
      this.delegateEvents();
    },

    className: 'page home',

    changePage: function (event) {

      var target = $(event.currentTarget);
      app.router.navigate(target.data('viewPage'), {trigger:true});

      event.preventDefault();
    },

    onClose: function () {
      if (this.loginButtonView) {
        this.loginButtonView.close();
      }
    }, 

    render: function () {

      var container = $(this.el);

      var html = '';
      html += '<h1 class="betterAngelsTitle"></h1>';

      html += '<div class="menu">';
      html += '<div class="fauxlink menuItem" data-view-page="character/new"><span>Create</span></div>';
      html += '<div class="fauxlink menuItem" data-view-page="list"><span>List</span></div>';
      html += '<br />';
      html += '<div class="fauxlink menuItem" data-view-page="page/cheat"><span>Cheat Sheet</span></div>';
      html += '<div class="fauxlink menuItem" data-view-page="page/more"><span>More</span></div>';
      html += '</div>';

      container.append(html);

      this.loginButtonView = new app.ViewFacebookLoginButton();
      container.append(this.loginButtonView.render().el);

      return this;
    }
});