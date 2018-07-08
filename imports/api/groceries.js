import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { authCheck } from '../../utils/authorization';
 
export const Groceries = new Mongo.Collection('groceries');

Meteor.publish('groceries', function() {
	return Groceries.find({ owner: this.userId });
});

Meteor.methods({
	'groceries.insert'(name, amount) {
		check(name, String);

		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		if (name.length === 0) {
			throw new Meteor.Error('name cannot be empty')
		}
		
		return Groceries.insert({
			name: name.trim(),
			amount: amount.trim(),
			owner: this.userId,
			createdAt: new Date(),
		});
	},
	'groceries.remove'(groceryId) {
		check(groceryId, String);
		authCheck(Groceries, this.userId, groceryId);

		return Groceries.remove(groceryId);
	},
	'groceries.setChecked'(groceryId, setChecked) {
		check(groceryId, String);
		check(setChecked, Boolean);
		authCheck(Groceries, this.userId, groceryId);

		return Groceries.update(groceryId, {
			$set: { checked: setChecked }
		});
	},
	'groceries.updateName'(groceryId, name) {
		check(groceryId, String);
		check(name, String);
		authCheck(Groceries, this.userId, groceryId);

		return Groceries.update({ _id: groceryId }, {
			$set: { name: name.trim() }
		});
	},
	'groceries.updateAmount'(groceryId, amount) {
		check(groceryId, String);
		check(amount, String);
		authCheck(Groceries, this.userId, groceryId);

		return Groceries.update({ _id: groceryId }, {
			$set: { amount: amount.trim() }
		});
	}
});