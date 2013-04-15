app.ViewTabAbilities = Backbone.View.extend({

  events: {
    'click .fauxlink.add'             : 'abilityUIOpen',
    'click .fauxlink.ability'         : 'abilityUIOpen',
    'click .fauxlink.delete'          : 'abilityDelete',
    'click .fauxlink.deleteConfirm'   : 'abilityDeleteConfirm',
    'click .fauxlink.deleteCancel'    : 'abilityDeleteCancel',
    'click .fauxlink.statBlockEdit'   : 'abilityEdit',
    'keyup input.specialtySlot'       : 'specialtyAdd',
  },

  className: 'ViewTabAbilities',

  initialize: function () {
    this.model.on('change:aspects change:powers change:specialties', this.render, this);
  },

  abilityUIOpen: function (event) {
    
    var data = $(event.currentTarget).data();

    if (data.specialties) {
       
       var view = new app.ViewDialogSpecialties({model:this.model});

    } else {

      if (!$(event.target).parents('.statBlock').hasClass('editMode')) {
        return false;
      }

      var view = new app.ViewDialogAbilitySelector({model:this.model});
      view.setAbilityType(data['abilityType']);
      view.setSlot(data['abilitySlot']);

      if (data['uniqueId']) {
        view.setOldAbilityUniqueId(data['uniqueId']);
        view.setSelectedAbility(data['uniqueId']);
      }

    }

    app.dispatcher.trigger('ui.show_dialog', view);
    event.preventDefault();

  },

  abilityEdit: function (event) {

    if (!this.model.isOwner()) {
      app.dispatcher.trigger('ui.show_dialog', new app.ViewDialogImportPregen({model:this.model}));
    } else {
      $(event.target).parents('.statBlock').toggleClass('editMode');  
    }

    event.preventDefault();
  },

  abilityAdd: function (event) {
    
    var data = $(event.currentTarget).data();

    var view = new app.ViewDialogAbilitySelector({model:this.model});
    view.setAbilityType(data['abilityType']);
    

    var newSlot = 0;
    if (data.abilityType == 'power') {
      var slotCount = _.max(_.keys(this.model.getPowers()));
      newSlot = slotCount + 1;
    } else {
      var slotCount = _.max(_.keys(this.model.getAspects()));
      newSlot = slotCount + 1;
    }
    view.setSlot(newSlot); 

    app.dispatcher.trigger('ui.show_dialog', view);


       

    event.preventDefault();
  },

  abilityDelete: function (event) {

    var container = $(event.currentTarget).parents('.abilityBox');
    container.children('.deleteBox').css('display', 'block');
    container.children('.fauxlink.delete, .fauxlink.ability').css('display', 'none');

    event.preventDefault();
  },

  abilityDeleteConfirm: function (event) {

    var data = $(event.currentTarget).data();
    if (data.abilityType == 'power') {
      this.model.removePowerBySlot(data.abilitySlot);
    } else {
      this.model.removeAspectBySlot(data.abilitySlot);
    }

    event.preventDefault();
  },

  abilityDeleteCancel: function (event) {

    var container = $(event.currentTarget).parents('.abilityBox');
    container.children('.deleteBox').css('display', 'none');
    container.children('.fauxlink.delete, .fauxlink.ability').css('display', 'block');

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

    var container = $(this.el);

    var html = '';

    html += '<div class="wrapper">';  

    html += '<div class="statBlock abilityBoxContainer first">';
    html += ' <div class="statBlockTitle">Powers<div class="fauxlink statBlockEdit" data-ability-type="power">Edit</div></div>';
    for (var slot in powers) {
      html += this.renderAbilityRow(slot, powers[slot], true);
    }
    html += this.renderAbilityRow('new', false, true);

    html += ' <div class="abilityDescription">A human can use powers at will, but the rider will awaken.</div>';    

    html += '</div>';


    html += '<div class="statBlock abilityBoxContainer">';
    html += ' <div class="statBlockTitle">Aspects<div class="fauxlink statBlockEdit" data-ability-type="aspect">Edit</div></div>';
    for (var slot in aspects) {
      html += this.renderAbilityRow(slot, aspects[slot], false);
    }   
    html += this.renderAbilityRow('new', false, false);    
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

    container.html(html);

    return this;    
  },

  renderAbilityRow: function (abilitySlot, abilityUniqueId, isPower) {
     
      var abilityModel = (abilityUniqueId) ? registry.getSupernaturalAbility(abilityUniqueId, this.model.getCharacterType()) : false;
      var isNew = (abilitySlot == 'new');
      var html = '';

      html += '<div class="abilityBox ' + (isNew ? 'new' : '') +'" data-ability-slot="' + abilitySlot +'">';

      html += '<div class="fauxlink action ' + (isNew ? 'add' : 'delete') + '" data-ability-slot="' + abilitySlot +'" data-ability-type="' + (isPower ? 'power' : 'aspect') + '" ' + (abilityModel ? 'data-unique-id="' + abilityModel.getUniqueId() + '"' : '') + '></div>';

      html += '<div class="fauxlink ability" data-ability-slot="' + abilitySlot +'" data-ability-type="' + (isPower ? 'power' : 'aspect') + '" ' + (abilityModel ? 'data-unique-id="' + abilityModel.getUniqueId() + '"' : '') + '>';
      if (abilityModel) {

          html += '<div class="name">' + abilityModel.getName(this.model.getCharacterType()) + ' (' + abilityModel.getTactic(this.model.getCharacterType()) + ') ' + abilityModel.getNumDice(this.model) + 'd </div>';
          html += '<div class="shortDesc">' + abilityModel.getShortDescription() + '</div>';

      } else {
          html += '<div class="name">Tap to add ' + (isPower ? 'a power' : 'an aspect') + '</div>';
          html += '<div class="shortDesc"></div>';
      }
      html += '</div>';

      if (abilityModel) {
        html += '<div class="deleteBox" style="display:none;">';
        html += '   <b>Remove ' + abilityModel.getName() + '?</b>';

        html += '   <div class="fauxlink deleteCancel">';
        html += '     Cancel';
        html += '   </div>';

        html += '   <div class="fauxlink deleteConfirm" data-ability-slot="' + abilitySlot +'" data-ability-type="' + (isPower ? 'power' : 'aspect') + '">';
        html += '     Delete';
        html += '   </div>';
        
        html += '</div>';
      }

      html += '</div>'; // end abilityBox

      return html;
  },

});