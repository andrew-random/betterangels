var registry = {

	supernaturalAbilities: {},
	characters: {},
	charactersLoaded: false,

	initialize: function () {

		// init ability collections
		this.supernaturalAbilities.angelPowers 	= new app.CollectionSupernaturalAbility();
		this.supernaturalAbilities.angelAspects = new app.CollectionSupernaturalAbility();
		this.supernaturalAbilities.demonPowers 	= new app.CollectionSupernaturalAbility();
		this.supernaturalAbilities.demonAspects = new app.CollectionSupernaturalAbility();

		// init models from cache data
		for (var power_type in cacheData.ability) {
			for (var x in cacheData.ability[power_type]) {
				var ability = cacheData.ability[power_type][x];

				if (power_type == 'aspect') {
					
					var abilityModel = new app.ModelSupernaturalAbility(ability);
					abilityModel.setAbilityType(app.ModelSupernaturalAbility.AbilityTypeAspect);

					if (abilityModel.getGoodTactic()) {
						this.supernaturalAbilities.angelAspects.add(abilityModel);
					}
					if (abilityModel.getEvilTactic()) {
						this.supernaturalAbilities.demonAspects.add(abilityModel);
					}

				} else {

					var abilityModel = new app.ModelSupernaturalAbility(ability);
					abilityModel.setAbilityType(app.ModelSupernaturalAbility.AbilityTypePower);

					if (abilityModel.getGoodTactic()) {
						this.supernaturalAbilities.angelPowers.add(abilityModel);
					}
					if (abilityModel.getEvilTactic()) {
						this.supernaturalAbilities.demonPowers.add(abilityModel);
					}
				}
			}
		}

		// init character collection
		this.characters.pregen = new app.CollectionCharacter();		// all pregens - will populate immediately
		this.characters.custom = new app.CollectionCharacter();		// all custom characters. These will need to be queried for.

		// pull pregen characters from cache data
		for (var x in cacheData.characters.pregen) {
			var characterModel = new app.ModelCharacter(cacheData.characters.pregen[x]);
			this.characters.pregen.add(characterModel);
		}
	},

	getSupernaturalAbility: function (powerUniqueId, characterType) {
		for (var x in this.supernaturalAbilities) {

			if (characterType && x.indexOf(characterType) == -1) {
				continue;
			}

			var abilityModel = this.supernaturalAbilities[x].find(function (abilityModel) {
				if (abilityModel.getUniqueId() == powerUniqueId) {
					return true;
				}
			});

			if (abilityModel) {
				return abilityModel;
			}
		}
		return false;
	},

	getAllAspects: function (characterType) {
		return (characterType == 'angel') ? this.supernaturalAbilities.angelAspects : this.supernaturalAbilities.demonAspects;
	},

	getAllPowers: function (characterType) {
		return (characterType == 'angel') ? this.supernaturalAbilities.angelPowers : this.supernaturalAbilities.demonPowers;
	},

	getAllPregenCharacters: function () {
		return this.characters.pregen;
	},

	getAllCustomCharacters: function () {
		return this.characters.custom;
	},

	getCharacterByUniqueId: function (uniqueId) {
		for (var x in this.characters) {

			var characterModel = this.characters[x].find(function (characterModel) {
				if (characterModel.getUniqueId() == uniqueId) {
					return true;
				}
			});

			if (characterModel) {
				return characterModel;
			}
		}
		return false;
	},

	importPregen: function (pregenCharacterModel) {

		// get current character data
		var oldData = pregenCharacterModel.toJSON();

		// we use a jquery hack to copy the object
		var cloneData = jQuery.extend(true, {}, oldData);
		
		// remove old uniqueId
		delete cloneData['unique_id'];

		// new model with clone data
		var customCharacterModel = new app.ModelCharacter(cloneData);

		// change owner
		customCharacterModel.setFbUserId(app.user.getFacebookId());

		// update created date
		customCharacterModel.setCreated(Math.ceil(new Date().getTime()/1000), {silent:true});

		// update last modified date
		customCharacterModel.setModified(Math.ceil(new Date().getTime()/1000), {silent:true});

		// a few custom props
		customCharacterModel.setIsPregen(false);
		customCharacterModel.setMetaTag('group', 'Imported');

		// the heartbeat will catch that this guy needs saving
		customCharacterModel.setHasUnsavedChanges(true);

		// push to registry
		registry.addCustomCharacter(customCharacterModel);

		// Kick the heart
		app.heartBeat();

		return customCharacterModel;
	},

	addCustomCharacter: function (characterModel) {
		this.characters.custom.add(characterModel);
	},

	removeCustomCharacter: function (characterModel) {
		
		// remove the model from the collection
		this.characters.custom.remove(characterModel);

	},

	getAllMetaTags: function (tagName) {
		var data = {};
		data['Allies'] 	= 'Allies';
		data['Enemies'] = 'Enemies';

		// scan custom chars
		var characterModel = this.characters.custom.each(function (characterModel) {
			var metaTag = characterModel.getMetaTag('group');
			if (metaTag) {
				data[metaTag] = metaTag;	
			}
		});

		// scan pregen chars
		var characterModel = this.characters.pregen.each(function (characterModel) {
			var metaTag = characterModel.getMetaTag('group');
			if (metaTag) {
				data[metaTag] = metaTag;	
			}
		});
		return data;
	},

	getImageSources: function () {
		return {'facebook':'Facebook', 'gallery':'Gallery'};
	},

	getLocalGalleryImages: function () {
		return [
			'chae-jin-sook.jpg',
			'doorman.jpg',
			'everlove.jpg',
			'gorillawrench.jpg',
			'judge-attenborough.jpg',
			'lifeshooter.jpg',
			'lumos-pantera.jpg',
			'mr-dignity.jpg',
			'pavior.jpg',
			'sea-change.jpg',
			'shining-diamond.jpg',
			'steven-stiles.jpg'
		];

	}

}