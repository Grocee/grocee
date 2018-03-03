import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Recipes = new Mongo.Collection('recipes');

if (Meteor.isServer) {
	Meteor.publish('recipes', function taskPublication() {
		return Recipes.find();
	});
}

Meteor.methods({
	'recipes.insert'(name, url) {
		check(name, String);
		check(url, String);

		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Recipes.insert({
			name: name,
			url: url,
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
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
});