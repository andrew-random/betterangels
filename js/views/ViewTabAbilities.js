app.ViewTabAbilities = app.ViewTab.extend({

  events: {
   // 'click .fauxlink.delete'          : 'abilityDelete',
   // 'click .fauxlink.deleteConfirm'   : 'abilityDeleteConfirm',
    //'click .fauxlink.deleteCancel'    : 'abilityDeleteCancel',
    'click .fauxlink.statBlockEdit'   : 'abilityEdit',
    'keyup input.specialtySlot'       : 'specialtyAdd',
  },

  views: {'power':[], 'aspect':[]},
  className: 'ViewTabAbilities',

  close: function () {
    for (var x in this.views) {
      for (var y in this.views[x]) {
        this.views[x][y].close();
      }
      
    }
  },

  initialize: function () {
    this.model.on('change:aspects change:character_type change:powers change:specialties', this.render, this);
  },

  abilityEdit: function (event) {

    if (!this.model.isOwner()) {
      app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
    } else {
      if ($(event.target).data('abilityType') != 'specialties') {
        var views = this.views[$(event.target).data('abilityType')];

        for (var x in views) {
          if (views[x].getMode() == app.ViewSupernaturalAbility.ModeView) {
            views[x].setMode(app.ViewSupernaturalAbility.ModeEdit);
          } else {
            views[x].setMode(app.ViewSupernaturalAbility.ModeView);
          }
          
          views[x].render();
        }
      }
      
    }

    event.preventDefault();
  },

  specialtyAdd: function (event) {

    var target        = $(event.target);
    var newSpecialty  = target.val();
    var slot          = target.data('slot');
    
    clearTimeout(event.target.timeout);

    event.target.timeout = setTimeout(_.bind(function () {
      this.model.addSpecialty(slot, newSpecialty);
      target.prev('label').text(newSpecialty);
    }, this), 1000);

  },

  render: function() {

    var powers      = this.model.getPowers();
    var aspects     = this.model.getAspects();
    var specialties = this.model.getSpecialties();

    // clear out bogus child views
    this.resetViewStack();

    var html = '';

    html += '<div class="wrapper">';  

    html += '<div class="statBlock abilityBoxContainer first">';
    html +=   '<div class="statBlockTitle">Powers<div class="fauxlink statBlockEdit" data-ability-type="power">Edit</div></div>';
    html +=   '<div class="powers"></div>';
    html +=   '<div class="abilityDescription">A human can use powers at will, but the rider will awaken.</div>';    
    html += '</div>';


    html += '<div class="statBlock abilityBoxContainer">';
    html += ' <div class="statBlockTitle">Aspects<div class="fauxlink statBlockEdit" data-ability-type="aspect">Edit</div></div>';
    html +=   '<div class="aspects"></div>'; 
    html += ' <div class="abilityDescription">A human must bargain to use aspects. The price will be steep, because the rider will weaken.</div>';    
    html += '</div>';

    html += '<div class="statBlock abilityBoxContainer last">';
    html += ' <div class="statBlockTitle">Specializations<div class="fauxlink statBlockEdit" data-ability-type="power">Edit</div></div>';

    html += '   <div class="specialtyContent">';
    for (var slot = 0; slot < 3; slot++) {

      var specialtyName = (typeof specialties[slot] != 'undefined') ? specialties[slot] : ''

      html += '     <div class="slot ' + (specialtyName ? '' : 'empty') +' clear-block">';
      html += '          <div class="slotNumber">' + (slot + 1) + ') </div>';
      html += '          <label>' + specialtyName + '</label>';
      html += '          <input type="text" class="specialtySlot" data-slot="' + slot + '" value="' + specialtyName + '" />';
      html += '     </div>';
    }
    html += '   </div>';

    html += '   <div class="abilityDescription">Professional or Personal skills you are particularly good at.</div>';

    html += '</div>';

    html += '</div>';

    $(this.el).html(html);

    // loop through powers, add appropriate views
    for (var slot in powers) {
        var abilityUniqueId = powers[slot];
        var abilityModel = (abilityUniqueId) ? registry.getSupernaturalAbility(abilityUniqueId, this.model.getCharacterType()) : false;

        var abilityView = new app.ViewSupernaturalAbility({'model':this.model});        
        abilityView.setAbilityModel(abilityModel);
        abilityView.setSlot(slot);
        abilityView.setIsPower(true);
        this.appendToViewStack(abilityView, app.ModelSupernaturalAbility.AbilityTypePower);
        $('.powers', this.el).append(abilityView.render().el);
        
    }

    // 'new' slot
    var abilityView = new app.ViewSupernaturalAbility({'model':this.model});        
    abilityView.setIsNew(true);
    abilityView.setIsPower(true);
    $('.powers', this.el).append(abilityView.render().el);
    this.appendToViewStack(abilityView, app.ModelSupernaturalAbility.AbilityTypePower);


    // loop through aspects, add appropriate views
    for (var slot in aspects) {
        var abilityUniqueId = aspects[slot];
        var abilityModel = (abilityUniqueId) ? registry.getSupernaturalAbility(abilityUniqueId, this.model.getCharacterType()) : false;

        var abilityView = new app.ViewSupernaturalAbility({'model':this.model});        
        abilityView.setAbilityModel(abilityModel);
        abilityView.setSlot(slot);
        abilityView.setIsPower(false);

        $('.aspects', this.el).append(abilityView.render().el);
        this.appendToViewStack(abilityView, app.ModelSupernaturalAbility.AbilityTypeAspect);
    }

    // 'new' slot
    var abilityView = new app.ViewSupernaturalAbility({'model':this.model});        
    abilityView.setIsNew(true);
    abilityView.setIsPower(false);
    $('.aspects', this.el).append(abilityView.render().el);
    this.appendToViewStack(abilityView, app.ModelSupernaturalAbility.AbilityTypeAspect);

    return this;    
  },

  resetViewStack: function () {
    for (var abilityType in this.views) {
      for (var x in this.views[abilityType]) {
        if (this.views[abilityType][x].abilityModel && (!this.model.hasPower(this.views[abilityType][x].abilityModel.getUniqueId()) && !this.model.hasAspect(this.views[abilityType][x].abilityModel.getUniqueId()))) {
          this.views[abilityType][x].close();
          this.views[abilityType].splice(x, 1);
        }
      }
    }
  },

  appendToViewStack: function (view, abilityType) {


    // update existing views
    for (var x in this.views[abilityType]) {
      if (this.views[abilityType][x].getIsNew() && view.getIsNew()) {
      } else if (this.views[abilityType][x].abilityModel && view.abilityModel && this.views[abilityType][x].abilityModel.getUniqueId() == view.abilityModel.getUniqueId()) {
          this.views[abilityType][x] = view;
          return true;
      }
    }

    // if it doesn't exist, add it to the stack
    this.views[abilityType].push(view);
    return true;
  }

});