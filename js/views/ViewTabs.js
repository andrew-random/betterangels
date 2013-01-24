app.ViewTabs = Backbone.View.extend({

  tabs: {},

  activeTab: false,

  events: {
    "click .tabRow .tabHeader": 'clickActiveTab',
    "swipeleft"               : 'swipeTabLeft',
    "swipeleftup"             : 'swipeTabLeft',
    "swipeleftdown"           : 'swipeTabLeft',
    "swiperight"              : 'swipeTabRight',
    "swiperightup"            : 'swipeTabRight',
    "swiperightdown"          : 'swipeTabRight',
  },

  swipeTimeout: false,
  swipeDetectionBusy: false,
  swipeBusy: false,

  resizeInterval: false,

  initialize: function () {
    // we explictly set this to hack a pass-by-reference issue.
    this.tabs = {};

    // queue resizes
    this.resizeInterval = setInterval(_.bind(function () {
      this.resize();
    }, this), 500);
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

  swipeTabLeft: function (event, swipeEvent) {

    if (!this.canSwipe(swipeEvent)) {
      return false;
    }

    // loop through to find the previous tab
    var previousTab = false;
    for (var x in this.tabs) {
      if (this.tabs[x].id == this.activeTab) {
        break;
      }
      previousTab = this.tabs[x].id;
    }

    if (previousTab) {
      this.showTab(previousTab);
    }
    
  },

  swipeTabRight: function (event, swipeEvent) {

    if (!this.canSwipe(swipeEvent)) {
      return false;
    }

    // loop through to find the next tab
    var nextTab = false;
    var currentTabFound = false;
    for (var x in this.tabs) {
      
      if (currentTabFound) {
        nextTab = this.tabs[x].id;
        break;  
      }

      if (this.tabs[x].id == this.activeTab) {
        currentTabFound = true;
      }
      
    }

    if (nextTab) {
      this.showTab(nextTab);
    }
  },

  canSwipe: function (swipeEvent) {
    
    // prevent duplicate events
    if (this.swipeDetectionBusy) {
      return false;
    }
    this.swipeDetectionBusy = true;

    var self = this;  // scope hack
    this.swipeTimeout = setTimeout(function () {
      self.swipeDetectionBusy = false;
    }, 100);

    var horizontal  = Math.abs(swipeEvent.delta[0].lastX);
    var vertical    = Math.abs(swipeEvent.delta[0].lastY);
    var duration    = swipeEvent.duration;

    var doSwipe = false;
    if (duration > 250) {
      
      // slow swipes get ignored
      doSwipe = false;

    } else {
      if (horizontal > 100 && vertical < 60) {

        // primary horizontal swipe
        doSwipe = true;

      } else if (horizontal < 150 && vertical < 150) {

        // not enough difference between movement directions
        doSwipe = false;
      }
    }

    return doSwipe;
  },

  onClose: function () {
    // close all child views
    for (var x in this.tabs) {
      this.tabs[x].view.close();
    }
    clearInterval(this.resizeInterval);

    this.resizeInterval = null;
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

    if (this.swipeBusy) {
      return false;
    }

    this.setActiveTab(activeTab);

    this.swipeBusy = true;

    // update tab row
    $('.tabRow .tabHeader', this.el).removeClass('active');
    $('.tabRow .tabHeader.' + activeTab, this.el).addClass('active');

    //$('.tabContentContainer .tabContent', this.el).removeClass('active');
    //$('.tabContentContainer .tabContent.' + activeTab, this.el).addClass('active');  
    var tabNum = this.getActiveTabNum();
    var tabContentContainer = $('.tabContentContainer .tabContent', this.el);
    var activeTabDom        = $('.tabContentContainer .tabContent.' + activeTab, this.el);

    if (force) {

      $('.tabContentContainer', this.el).css({left: (tabNum * -100) + '%'});
      this.swipeBusy = false;
      var currentTabHeight = activeTabDom.css({'height':'auto'}).height();
      if (currentTabHeight) {
        tabContentContainer.css({height:currentTabHeight, 'overflow':'hidden'});
      }

    } else {

      var self = this;
      $('.tabContentContainer', this.el).animate({left: (tabNum * -100) + '%'}, function () {
        
        var currentTabHeight = activeTabDom.css({'height':'auto'}).height();
        if (currentTabHeight) {
          tabContentContainer.css({height:currentTabHeight, 'overflow':'hidden'});
        }

        self.swipeBusy = false;

      });  
    }
  
    // forcibly scroll back to the top
    tabContentContainer.scrollTop(0);
    
  },

  resize: function () {

    var tabContentContainer = $('.tabContentContainer .tabContent', this.el);
    var activeTabDom      = $('.tabContentContainer .tabContent.' + this.getActiveTab(), this.el);    
    var oldTabHeight      = activeTabDom.height();
    var currentTabHeight  = activeTabDom.css({'height':'auto'}).height();
    if (currentTabHeight) {
      tabContentContainer.css({height:currentTabHeight, 'overflow':'hidden'});
    }
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
    html += '<div class="tabContainer">';
    

    html += '   <div class="tabRow ' + (_.size(this.tabs) == 2 ? 'two' : 'three') + '">';
    // individual tabs
    for (var x in this.tabs) {
      var className = 'tabHeader fauxlink ' + this.tabs[x].id;
      if (this.tabs[x].id == activeTab) {
        className += ' active';
      }

      html += '   <div class="' + className + '" data-tab="' + this.tabs[x].id + '">';
      html +=       this.tabs[x].label;
      html += '   </div>';
    }
    html += '   </div>';

    html += '   <div class="tabContentContainer" style="width:' + (this.getNumTabs() * 100) + '%;">';
    html += '   </div>';

    html += '</div>';

    // push to content
    $(this.el).html(html);

    // add tabs to html
    for (var x in this.tabs) {
      var tabData = this.tabs[x];
      var tabContent = $('<div class="tabContent ' + tabData.id + '" data-tab="' + tabData.id + '" style="width:' + (100 / this.getNumTabs()) +'%;"></div>');
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