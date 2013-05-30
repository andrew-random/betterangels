app.ViewTabs = Backbone.View.extend({

  tabs                  : {},

  activeTab             : false,
  className             : 'tabContainer',
  changeLocationOnClick : true,

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
    if (activeTab == this.activeTab || !this.canShowTab(activeTab)) {
        return false;
    }

    if (this.changeLocationOnClick) {
        var parentHash = document.location.hash;
        var tabPos = parentHash.indexOf('/tab/');
        if (tabPos != -1) {
            parentHash = parentHash.substring(0, tabPos);
        }
        app.router.navigate(parentHash + '/tab/' + activeTab, {replace:true});
    }
    

    this.showTab(activeTab, true);

    event.preventDefault();
    
    return this;
  },

  setChangeLocationOnClick: function (value) {
    this.changeLocationOnClick = value;
  },

  onClose: function () {
    // close all child views
    for (var x in this.tabs) {
      this.tabs[x].view.close();
    }
  },

  canShowTab: function (activeTab) {
    for (var x in this.tabs) {
      if (this.tabs[x].id == activeTab) {
          return this.tabs[x].view.canShowTab();
      }
    }
    return false;
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

    console.log('showing tab', activeTab);

    // store which tab is in use
    this.setActiveTab(activeTab);

    // hide all tabs
    $('.tabRow .tabHeader, .tabContentContainer .tabContent', this.el).removeClass('active');

    // highlight tab header and show content
    $('.tabRow .tabHeader[data-tab=' + activeTab + '], .tabContentContainer .tabContent[data-tab=' + activeTab + '],', this.el).addClass('active');

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
    html += '<div class="tabRow ' + (_.size(this.tabs) == 2 ? 'two' : 'three') + '"></div>';
    html += '<div class="tabContentContainer"></div>';

    // push to content
    $(this.el).html(html);

    // add tabs to html
    for (var x in this.tabs) {

      var tabData = this.tabs[x];

      // tabHeader
      $('.tabRow', this.el).append(this.getTabHeaderContent(tabData));

      // tabContent
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
    
  },

  getTabHeaderContent: function (tabData) {
      // tabHeader
      var className = tabData.id;
      if (tabData.id == this.getActiveTab()) {
        className += ' active';
      }
      if (!tabData.view.canShowTab()) {
        className += ' disabled';
      }

      var html = '';
      html +=   '<div class="tabHeader ' + className + '" data-tab="' + tabData.id + '">';
      html +=       '<div class="tabArrowLeft"></div>';
      html +=       tabData.label;
      html +=       '<div class="tabArrowRight"></div>';
      html +=       '<div class="fauxlink tabBoundingBox ' + tabData.id + '"></div>';
      html +=   '</div>';
      return html;
  },

  updateTabRow: function () {
    $('.tabHeader', this.el).each(_.bind(function (index, element) {
        var target  = $(element);
        var tabId   = $(element).data('tab');
        if (tabId == this.getActiveTab()) {
          target.addClass('active');
        } else {
          target.removeClass('active');
        }

        if (!this.canShowTab(tabId)) {
           target.addClass('disabled');
        } else {
          target.removeClass('disabled');
        }
    }, this));
  },

  renderTab: function (tabId) {

      for (var x in this.tabs) {
        var tabData = this.tabs[x];

        if (tabData.id == tabId) {
          $('.tabHeader[data-tab=' + tabId +']', this.el).replaceWith(this.getTabHeaderContent(tabData));
          $('.tabContent[data-tab=' + tabId +']', this.el).html(tabData.view.render().el);
        }
      }
  }

});