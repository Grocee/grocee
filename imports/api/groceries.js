import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Groceries = new Mongo.Collection('groceries');

Meteor.methods({
	'groceries.insert'(name, amount) {
		check(name, String);
		check(amount, String);

		// TODO: also check for user
		
		Groceries.insert({
			name: name,
			amount: amount,
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