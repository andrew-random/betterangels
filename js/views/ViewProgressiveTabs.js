app.ViewSequentialTabs = app.ViewTabs.extend({

  
  clickActiveTab: function (event) {

    var activeTab = $(event.currentTarget).data('tab');

    // abort out if there's no change.
    if (activeTab == this.activeTab) {
        return false;
    }

    var parentHash = document.location.hash;
    var tabPos = parentHash.indexOf('/tab/');
    if (tabPos != -1) {
      parentHash = parentHash.substring(0, tabPos);
    }
    app.router.navigate(parentHash + '/tab/' + activeTab, {replace:true});

    this.showTab(activeTab, true);

    event.preventDefault();
    
    return this;
  },

  showTab: function (activeTab, force) {

    if (!activeTab.canShowTab()) {
        return false;
    }

    this.setActiveTab(activeTab);

    // update tab row
    $('.tabRow .tabHeader', this.el).removeClass('active');
    $('.tabRow .tabHeader.' + activeTab, this.el).addClass('active');

    $('.tabContentContainer .tabContent', this.el).removeClass('active');
    $('.tabContentContainer .tabContent.' + activeTab, this.el).addClass('active');  
    
  },

  render: function() {

    var activeTab = this.getActiveTab();

    var html = '';

    html += '   <div class="tabRow ' + (_.size(this.tabs) == 2 ? 'two' : 'three') + '">';
    // individual tabs
    for (var x in this.tabs) {
      var className = 'tabHeader fauxlink ' + this.tabs[x].id;
      if (this.tabs[x].id == activeTab) {
        className += ' active';
      }

      html +=   '<div class="' + className + '" data-tab="' + this.tabs[x].id + '">';
      html +=       this.tabs[x].label;
      html +=   '</div>';
    }
    html += '   </div>';

    html += '   <div class="tabContentContainer">';
    html += '   </div>';

    // push to content
    $(this.el).html(html);

    // add tabs to html
    for (var x in this.tabs) {
      var tabData = this.tabs[x];
      var tabContent = $('<div class="tabContent ' + tabData.id + '" data-tab="' + tabData.id + '"></div>');
      tabContent.append(tabData.view.render().el);

      $('.tabContentContainer', this.el).append(tabContent);

    }

    var self = this; // scope hack
    if (activeTab) {
      setTimeout(function () {
        // activate child tab
        self.showTab(activeTab, true);  
      }, 15);
    }

    return this;
    
  }

});