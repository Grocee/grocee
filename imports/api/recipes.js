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

		// TODO: also check for user
		
		Recipes.insert({
			name: name,
			url: url,
			createdAt: new Date(),
		});
	},
	'recipes.remove'(recipeId) {
		check(recipeId, String);

		Recipes.remove(recipeId);
	},
});