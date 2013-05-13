app.ViewTabs = Backbone.View.extend({

  tabs: {},

  activeTab: false,
  className: 'tabContainer',

  events: {
    "click .tabRow .tabHeader": 'clickActiveTab',
  },

  initialize: function () {
    // we explictly set this to hack a pass-by-reference issue.
    this.tabs = {};
  },

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

  onClose: function () {
    // close all child views
    for (var x in this.tabs) {
      this.tabs[x].view.close();
    }
  },

  setActiveTab: function (tabId) {
    this.activeTab = tabId;
  },

  getActiveTab: function () {

    // select first tab if none selected    
    if (!this.activeTab) {

      // try and pull from URL hash
      var urlAnchorTab = false;
      var tabPos = document.location.hash.indexOf('/tab/');
      if (tabPos != -1) {
        this.activeTab = document.location.hash.substring(tabPos + 5, 99);
      }
      
      // nothing? Well, grab the first tab in the stack.
      if (!this.activeTab) {
        for (var x in this.tabs) {
          if (!this.activeTab) {
            this.activeTab = this.tabs[x].id;
          }
        }
      }
    }
    return this.activeTab;
  },

  addTab: function (tabId, tabLabel, tabChildView) {
    this.tabs[tabId] = {id:tabId, label:tabLabel, view:tabChildView};
    return this;
  },

  showTab: function (activeTab, force) {

    this.setActiveTab(activeTab);

    // update tab row
    $('.tabRow .tabHeader', this.el).removeClass('active');
    $('.tabRow .tabHeader.' + activeTab, this.el).addClass('active');

    $('.tabContentContainer .tabContent', this.el).removeClass('active');
    $('.tabContentContainer .tabContent.' + activeTab, this.el).addClass('active');  
    
  },

  getNumTabs: function () {
    return _.size(this.tabs);
  },

  getActiveTabNum: function () {
    var num = 0;
    for (var x in this.tabs) {
      if (this.tabs[x].id == this.getActiveTab()) {
        return num;
      }
      num++;
    }
    return 0;
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