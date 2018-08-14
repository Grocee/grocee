import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { authCheck } from '../../utils/authorization';
 
export const Recipes = new Mongo.Collection('recipes');

// If use arrow function this.userId will return undefined
Meteor.publish('recipes', function() {
	return Recipes.find({ owner: this.userId });
});

Meteor.methods({
	'recipes.insert'(name, url) {
		check(name, String);
		check(url, String);

		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		if (name.length === 0) {
			throw new Meteor.Error('name cannot be empty')
		}

		if (url.length === 0) {
			throw new Meteor.Error('url cannot be empty')
		}

		Recipes.insert({
			name: name.trim(),
			url: url.trim(),
			owner: this.userId,
			createdAt: new Date(),
		});
	},
	'recipes.remove'(recipeId) {
		check(recipeId, String);

		// Make sure only the owner can delete
		const recipe = Recipes.findOne(recipeId);
		if (recipe.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Recipes.remove(recipeId);
	},
	'recipes.archive'(recipeId, archived = true) {
		check(recipeId, String);
		authCheck(Recipes, this.userId, recipeId);

		return Recipes.update(recipeId, {
			$set: { archived }
		});
	},
	'recipes.update'(recipeId, name, url) {
		check(recipeId, String);
		check(name, String);
		check(url, String);

		authCheck(Recipes, this.userId, recipeId);

		return Recipes.update({ _id: recipeId }, {
			$set: { name: name.trim(), url: url.trim() }
		})

	}
});