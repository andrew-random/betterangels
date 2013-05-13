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
			html += ' <div class="wrapper">';

			html +=   '<h1 class="betterAngelsTitle"></h1>';

			html +=	  '<div class="userAccount"></div>';

			html +=   '<div class="menu">';
			html +=     '<div class="fauxlink menuItem" data-view-page="character/new"><span>Create Character</span></div>';
			html +=     '<div class="fauxlink menuItem" data-view-page="list/"><span>Show Characters</span></div>';
			html +=     '<div class="fauxlink menuItem" data-view-page="page/cheat"><span>Cheat Sheet</span></div>';
			html += 	'</div>';
			html += '</div>';      

			container.append(html);

			this.loginButtonView = new app.ViewFacebookLoginButton();
			$('.userAccount', container).append(this.loginButtonView.render().el);

			return this;
		}
});