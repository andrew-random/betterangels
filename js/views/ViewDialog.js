app.ViewDialog = Backbone.View.extend({

  isVisible     : false,  // boolean
  activeDialog  : false,  // currently active dialog view
  dialogSize    : '',
  title         : 'Default Title',

  initialize: function (options) {
    app.dispatcher.on('ui.show_dialog', this.showDialog, this);
    app.dispatcher.on('ui.hide_dialog', this.hide, this);

    $('#appDialogContent').prop('className', this.dialogSize);
  },

  showDialog: function (viewObject) {
    this.setDialog(viewObject);
    this.render();
    this.show();
  },

  setDialog: function (viewObject) {
    this.activeDialog = viewObject;
  },

  getTitle: function () {
    return this.title;
  },


  show: function (event) {
    // overlay
    $('#appOverlay').addClass('active');

    // dialog box
    $('#appDialog').prop('className', 'active');

    // content
    $('#appDialog').addClass(this.dialogSize);

    if (event) {
      event.preventDefault();
    }

    // prevent focus from getting confused
    /*setTimeout(function () {
      if (document.activeElement) {
        $(document.activeElement).blur();
      }
    }, 500);*/
    
  },

  hide: function (event) {

    if (this.activeDialog) {
      this.activeDialog.close();
    }

    // overlay
    $('#appOverlay').removeClass('active');

    // dialog box
    $('#appDialog').removeClass('active');

    if (event) {
      event.preventDefault();
    }
  },

  render: function () {
    $('#appDialogHeader span').html(this.activeDialog.getTitle());

    $('#appDialogContent', this.el).html(this.activeDialog.render().el);
  }

});
app.ViewDialog.DialogSizeDefault  = 'default';
app.ViewDialog.DialogSizeNarrow   = 'narrow';
