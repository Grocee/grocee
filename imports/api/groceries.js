import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Groceries = new Mongo.Collection('groceries');

Meteor.methods({
	'groceries.insert'(name, quantity) {
		check(name, String);
		check(quantity, String); // Maybe check it's a number?

		// TODO: also check for user
		
		Groceries.insert({
			name: name,
			quanity: quantity,
			createdAt: new Date(),
		});
	},
	'groceries.remove'(groceryId) {
		check(groceryId, String);

		Groceries.remove(groceryId);
	},
	'groceries.setChecked'(groceryId, setChecked) {
		check(groceryId, String);
		check(setChecked, Boolean);

		Groceries.update(groceryId, { $set: { checked: setChecked } });
	},
});