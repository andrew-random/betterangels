app.ModelCharacter = Backbone.Model.extend({

	idAttribute: "unique_id",	// set the unique key for the DB row

	unsavedChanges: false,

	ajaxBusy: false,

	defaults: {
		'unique_id' 	: null,					// string 	unique DB identifier
		'fb_user_id'	: null,					// string	Facebook user id of character's owner 		
		'player_name' 	: '',					// string 	player name,
		'character_name': '',					// string 	character human name
		'character_type': '',					// string 	'angel', 'demon', 'human', 'other'
		'description' 	: '',					// string 	Character description
		'notes'			: '',					// string 	Player notes.	
		'rider_name'	: '',					// string 	rider name
		'rider_strategy': null,					// string 	rider's focus strategy
		'powers'		: {},					// array 	powers
		'aspects'		: {},					// array 	aspects
		'specialties'	: {},					// array 	specialties ( max 3 )
		'strategies'	: {},					// array 	strategies and tactics
		'image_url'		: '',					// string 	web URL
		'meta_tags'		: {},					// array	identifiers for this character such as 'Scenario 1', 'official', etc.

		'modified'		: null,					// timestamp of last modification
		'created'		: null,					// timestamp of creation
		'is_pregen'		: false,				// bool 	is a pregen or not
	},

	initialize: function () {

		// mark that this model needs to be saved to the DB
		this.on('change', function () { this.setHasUnsavedChanges( true); }, this);
	},

	setHasUnsavedChanges: function(value) {
		this.unsavedChanges = value;
	},

	hasUnsavedChanges: function() {
		return this.unsavedChanges;
	},

	parse: function (characterData) {
		this.setUniqueId(characterData.unique_id);
		this.setFbUserId(characterData.fb_user_id);
		this.setPlayerName(characterData.player_name);
		this.setCharacterName(characterData.character_name);
		this.setCharacterType(characterData.character_type);
		this.setIsNpc(characterData.is_npc);
		this.setDescription(characterData.description);
		this.setNotes(characterData.notes);
		this.setRiderName(characterData.rider_name);
		this.setRiderStrategy(characterData.rider_strategy);
		this.setPowers(characterData.powers);
		this.setAspects(characterData.aspects);
		this.setStrategies(characterData.strategies);
		this.setSpecialties(characterData.specialties);
		this.setImageUrl(characterData.image_url);
		this.setMetaTags(characterData.meta_tags);
		this.setModified(characterData.modified);
		this.setCreated(characterData.created);
		this.setIsPregen(characterData.is_pregen);
		this.setHasUnsavedChanges(false);
	},

	save: function (onSuccessCallback, onErrorCallback) {

		// don't save pregen characters
		if (!this.isOwner()) {
			return false;
		}

		if (this.isNew()) {

			// set created date
			this.setCreated(Math.ceil(new Date().getTime()/1000), {silent:true});

			// update last modified date
			this.setModified(Math.ceil(new Date().getTime()/1000), {silent:true});

			// hack
			this.setUniqueId(getHash(8));

			// set owner id
			this.setFbUserId(app.user.getFacebookId());

		} else {

			// update last modified date
			this.setModified(Math.ceil(new Date().getTime()/1000), {silent:true});
			
		}
		this.setHasUnsavedChanges(false);

		app.api('save_character', {'character':this.toJSON()}, _.bind(function (resp) {
				if (onSuccessCallback) {
					onSuccessCallback(resp);
				}
			}, this),
			_.bind(function (resp) {
				
				this.setHasUnsavedChanges(true);

				if (onErrorCallback) {
					onErrorCallback(resp);
				}
			}, this)
		);
		
	},

	destroy: function (onSuccessCallback, onErrorCallback) {

		// don't destroy pregen characters
		if (!this.isOwner()) {
			return false;
		}

		this.setAjaxBusy(true);

		app.dispatcher.trigger('ui.save_start');
		app.api('delete_character', {'character':this.toJSON()}, _.bind(function (resp) {
			
			this.setAjaxBusy(false);

			if (resp.success) {
				app.dispatcher.trigger('ui.save_success');
				registry.removeCustomCharacter(this);
				this.trigger('destroy');
			}
			
			if (onSuccessCallback) {
				onSuccessCallback(resp);
			}
		}, this),
		_.bind(function (resp) {

			app.dispatcher.trigger('ui.save_error');

			if (onErrorCallback) {
				onErrorCallback(resp);
			}
		}, this)
		);
		
	},

	getUniqueId: function () {
		return this.get('unique_id');
	},
	setUniqueId: function (uniqueId) {
		return this.set('unique_id', uniqueId);
	},
	
	getUniqueId: function() {
		return this.get('unique_id');
	},
	
	setCharacterName: function (value) {
		this.set('character_name', value);
	},
	getCharacterName: function () {
		return this.get('character_name');
	},
	
	setPlayerName: function (value) {
		this.set('player_name', value);
	},
	getPlayerName: function () {
		return this.get('player_name');
	},
	
	setRiderName: function (value) {
		this.set('rider_name', value);
	},
	getRiderName: function () {
		return this.get('rider_name');
	},

	setRiderStrategy: function (value) {
		this.set('rider_strategy', value);
	},
	getRiderStrategy: function () {
		return this.get('rider_strategy');
	},
	
	setCharacterType: function (value) {
		this.set('character_type', value);
	},
	getCharacterType: function (value) {
		return this.get('character_type');
	},

	setIsNpc: function (value) {
		this.set('is_npc', value);
	},
	getIsNpc: function () {
		return this.get('is_npc');
	},
	
	setDescription: function (value) {
		this.set('description', value);
	},
	getDescription: function (value) {
		return this.get('description');
	},

	setNotes: function (value) {
		this.set('notes', value);
	},
	getNotes: function (value) {
		return this.get('notes');
	},
	
	getStrategiesFormatted: function () {
		var data = [];
		
		data.push({
			'good':app.ModelCharacter.statPatient,
			'evil':app.ModelCharacter.statCunning,
			'children':[
				{
					'good':app.ModelCharacter.statGenerosity,
					'evil':app.ModelCharacter.statGreed
				},
				{
					'good':app.ModelCharacter.statKnowledge,
					'evil':app.ModelCharacter.statEspionage
				}
				]
		});
		data.push({
			'good':app.ModelCharacter.statOpen,
			'evil':app.ModelCharacter.statSly,
			'children':[
				{
					'good':app.ModelCharacter.statCourage,
					'evil':app.ModelCharacter.statCruelty
				},
				{
					'good':app.ModelCharacter.statEndurance,
					'evil':app.ModelCharacter.statCowardice
				}
				
				]
		});
		data.push({
			'good':app.ModelCharacter.statInsightful,
			'evil':app.ModelCharacter.statDevious,
			'children':[
				{
					'good':app.ModelCharacter.statNurture,
					'evil':app.ModelCharacter.statCorruption
				},
				{
					'good':app.ModelCharacter.statHonesty,
					'evil':app.ModelCharacter.statDeceit
				}
				
				]
		});
		return data;
	},

	setStrategies: function (data) {
		this.set('strategies', data);
		this.trigger('change change:strategies', data);
	},
	getStrategies: function () {
		return this.get('strategies');
	},
	
		
	slideStatValue: function (statName) {
		var statPair = this.getStatPair(statName);
		if (!statPair) {
			return false;
		}

		var strategies = this.getStrategies();
		
		if (statName == statPair.good) {
			strategies[statPair.good] += 1
			strategies[statPair.evil] += -1;
		} else {
			strategies[statPair.good] += -1
			strategies[statPair.evil] += 1;
		}
					
		if (strategies[statPair.good] > 5) {
			strategies[statPair.good] = 5;
		}
		if (strategies[statPair.evil] > 5) {
			strategies[statPair.evil] = 5;
		}
		
		if (strategies[statPair.good] < 0) {
			strategies[statPair.good] = 0;
		}
		if (strategies[statPair.evil] < 0) {
			strategies[statPair.evil] = 0;
		}

		this.trigger('stat_change', statName);
		
		this.setStrategies(strategies);

		return true;
	},
	
	incrementStatValue: function (statName, value) {

		if (!value) {
			value = 1;
		}

		var strategies = this.getStrategies();
		if (typeof strategies[statName] == 'undefined') {
			strategies[statName] = 0;
		}
		strategies[statName] += value;
		
		// make sure that two stats can't be even.
		var statPair = this.getStatPair(statName);
		var statGoodValue = this.getStatValue(statPair.good);
		var statEvilValue = this.getStatValue(statPair.evil);

		if ((statGoodValue + statEvilValue) > 7) {
			if (statPair.good == statName) {
				strategies[statPair.evil] += -1;
			} else {
				strategies[statPair.good] += -1;
			}
		}

		// prevent going out of bounds
		if (strategies[statName] < 0) {
			strategies[statName] = 0;
		} else if (strategies[statName] > 5) {
			strategies[statName] = 5;	
		}

		this.trigger('stat_change', statName);

		this.setStrategies(strategies);
		
	},

	decrementStatValue: function (statName, value) {
		if (!value) {
			value = 1;
		}
		this.incrementStatValue(statName, value * -1);
	},
	
	getStatValue: function (statName) {
		var strategies = this.getStrategies();
		if (typeof strategies[statName] == 'undefined') {
			strategies[statName] = 0;
		}
		return strategies[statName];
	},
	
	getStatPair: function (statName) {

		var allStats = this.getStrategiesFormatted();
		for (var x in allStats) {
			if (allStats[x].good == statName || allStats[x].evil == statName) {
				return {
					'good':allStats[x].good,
					'evil':allStats[x].evil,
					'major':true
					};
			}
			
			for (var y in allStats[x].children) {
				if (allStats[x].children[y].good == statName || allStats[x].children[y].evil == statName) {
				return {
						'good':allStats[x].children[y].good,
						'evil':allStats[x].children[y].evil,
						'major':false
						};
				}
			}
		}
		return false;
	},
	
	
	addPower: function (slot, value) {
		var powers = this.get('powers');
		powers[slot] = value;

		this.setPowers(powers);
	},
	getPowerBySlot: function (slot) {
		var powers = this.get('powers');
		return powers[slot];
	},
	removePowerBySlot: function (slot) {
		var powers = this.get('powers');
		delete powers[slot];

		this.setPowers(powers);
	},
	hasPower: function (value) {
		var powers = this.get('powers');
		for (var x in powers) {
			if (powers[x] == value) {
				return true;
			}
		}
		return false;
	},
	setPowers: function (data) {

		var tmp = {};
		var count = 0;

		// make sure this is a consecutive array
		for (var x in data) {
			tmp[count++] = data[x];
		}

		this.set('powers', tmp);
		this.trigger('change change:powers', tmp);
	},
	getPowers: function () {
		return this.get('powers');
	},


	
	addAspect: function (slot, value) {
		var aspects = this.get('aspects');
		aspects[slot] = value;

		this.setAspects(aspects);
	},
	getAspectBySlot: function (slot) {
		var aspects = this.get('aspects');
		return aspects[slot];
	},
	removeAspectBySlot: function (slot) {
		var aspects = this.get('aspects');
		delete aspects[slot];

		this.setAspects(aspects);
	},
	hasAspect: function (value) {
		var aspects = this.get('aspects');
		for (var x in aspects) {
			if (aspects[x] == value) {
				return true;
			}
		}
		return false;
	},
	setAspects: function (data) {

		var tmp = {};
		var count = 0;

		// make sure this is a consecutive array
		for (var x in data) {
			tmp[count++] = data[x];
		}

		this.set('aspects', tmp);
		this.trigger('change change:powers', tmp);
	},
	getAspects: function () {
		return this.get('aspects');
	},

	addSpecialty: function (slot, value) {
		var specialties = this.get('specialties');
		specialties[slot] = value;
		this.setSpecialties(specialties);
	},
	removeSpecialtyBySlot: function (slot) {
		var specialties = this.get('specialties');
		delete specialties[slot];

		this.setSpecialties(specialties);
	},
	setSpecialties: function (data) {

		var tmp = {};
		var count = 0;

		// make sure this is a consecutive array
		for (var x in data) {
			tmp[count++] = data[x];
		}

		this.set('specialties', tmp);
		this.trigger('change change:specialties', tmp);
	},
	getSpecialties: function () {
		return this.get('specialties');
	},

	setImageUrl: function (value) {
		this.set('image_url', value);
	},
	getImageUrl: function () {
		return this.get('image_url');
	},
	hasImageUrl: function () {
		return this.get('image_url') !== null && this.get('image_url') != '';
	},

	setIsPregen: function (value) {
		this.set('is_pregen', value);
	}, 

	getIsPregen: function () {
		return this.get('is_pregen');
	},

	setFbUserId: function (value) {
		this.set('fb_user_id', value);
	},
	getFbUserId: function () {
		return this.get('fb_user_id');
	},

	isOwner: function () {

		if (this.isNew()) {
			return true;
		}

		if (this.getIsPregen()) {
			return false;
		}

		return app.user.getFacebookId() && this.getFbUserId() == app.user.getFacebookId();
	},

	setMetaTags: function (data) {
		this.set('meta_tags', data);
		this.trigger('change change:meta_tags');
	},

	getMetaTags: function () {
		return this.get('meta_tags');
	},
	getMetaTag: function (tagType) {
		var allTags = this.getMetaTags();
		if (allTags && typeof allTags[tagType] != 'undefined') {
			return allTags[tagType];
		}
		return false;
	},
	setMetaTag: function (tagType, tagValue) {
		var allTags = this.getMetaTags();
		allTags[tagType] = tagValue;
		this.setMetaTags(allTags);
		return true;
	},
	deleteMetaTag: function (tagType) {
		var allTags = this.getMetaTags();
		delete allTags[tagType];
		this.setMetaTags(allTags);
		return true;
	},

	clearMetaTags: function () {
		this.setMetaTags(null);
	},

	setCreated: function (value) {
		this.set('created', value);
	},

	getCreated: function () {
		return this.get('created');
	},

	setModified: function (value) {
		this.set('modified', value);
	},

	getModified: function () {
		return this.get('modified');
	},

	getLastModifiedDateFormatted: function () {	
		var monthNames	= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
		var dayNames	= ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
		var date = new Date(this.getModified());
		return date.getHours() + ':' + date.getMinutes() + ' ' + dayNames[date.getDay()] + ' ' + monthNames[date.getMonth()] + ' ' + date.getDate();
	},

	getCreatedDateFormatted: function () {
		var monthNames	= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
		var dayNames	= ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
		var date = new Date(this.getCreated());
		return date.getHours() + ':' + date.getMinutes() + ' ' + dayNames[date.getDay()] + ' ' + monthNames[date.getMonth()] + ' ' + date.getDate();
	},

	getTotalCost: function () {
		var total = 0;
		var strategies 	= this.getStrategiesFormatted();
		var powers 		= this.getPowers();
		var aspects 	= this.getAspects();
		var specialties = this.getSpecialties();

		for (var x in strategies) {
			total += this.getStatValue(strategies[x].good) * 2;
			total += this.getStatValue(strategies[x].evil) * 2;
			for (var y in strategies[x].children) {
				total += this.getStatValue(strategies[x].children[y].good);
				total += this.getStatValue(strategies[x].children[y].evil);
			}
		}

		total += _.size(powers) * 2;
		total += _.size(aspects) * 2;
		for (var x in specialties) {
			if (specialties[x].length > 0) {
				total++;
			}
		}
		
		return total;
	},

	setAjaxBusy: function (value) {
		this.ajaxBusy = value;
		this.trigger('ajax_busy', value);
	}
});

/**
  *	 One of the only frustrating downsides of Backbone is that constants have to be defined at the bottom of classes. C'est la vie!
  * 
  */
// strategy
app.ModelCharacter.statPatient			= 'Patient';
app.ModelCharacter.statCunning			= 'Cunning';

// tactic
app.ModelCharacter.statGenerosity		= 'Generosity';
app.ModelCharacter.statGreed			= 'Greed';

// tactic
app.ModelCharacter.statKnowledge		= 'Knowledge';
app.ModelCharacter.statEspionage		= 'Espionage';


// strategy
app.ModelCharacter.statOpen				= 'Open';
app.ModelCharacter.statSly				= 'Sly';

// tactic
app.ModelCharacter.statCourage			= 'Courage';
app.ModelCharacter.statCruelty			= 'Cruelty';

// tactic
app.ModelCharacter.statEndurance		= 'Endurance';
app.ModelCharacter.statCowardice		= 'Cowardice';


// strategy
app.ModelCharacter.statInsightful		= 'Insightful';
app.ModelCharacter.statDevious			= 'Devious';

// tactic
app.ModelCharacter.statHonesty			= 'Honesty';
app.ModelCharacter.statDeceit			= 'Deceit';

// tactic
app.ModelCharacter.statNurture			= 'Nurture';
app.ModelCharacter.statCorruption		= 'Corruption';
