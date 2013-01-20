app.ViewDialog = Backbone.View.extend({

  isVisible     : false,  // boolean
  activeDialog  : false,  // currently active dialog view
  dialogSize    : '',

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


  show: function (event) {
    $('#appDialog').prop('className', 'active');
    $('#appDialogContent').prop('className', this.dialogSize);

    if (event) {
      event.preventDefault();
    }

    // prevent focus from getting confused
    setTimeout(function () {
      if (document.activeElement) {
        $(document.activeElement).blur();
      }
    }, 500);
    
  },

  hide: function (event) {

    if (this.activeDialog) {
      this.activeDialog.close();
    }

    $('#appDialog').removeClass('active');

    if (event) {
      event.preventDefault();
    }
  },

  render: function () {
    $('#appDialogContent', this.el).html(this.activeDialog.render().el);
  }

});
app.ViewDialog.DialogSizeDefault  = 'default';
app.ViewDialog.DialogSizeNarrow   = 'narrow';
