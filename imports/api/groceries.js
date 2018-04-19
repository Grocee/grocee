import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Groceries = new Mongo.Collection('groceries');

Meteor.publish('groceries', function() {
	return Groceries.find({ owner: this.userId });
});

Meteor.methods({
	'groceries.insert'(name, amount, grocerylistId) {
		check(name, String);
		check(amount, String);
		check(grocerylistId, String);

		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		if (name.length === 0) {
			throw new Meteor.Error('name cannot be empty')
		}

		if (amount.length === 0) {
			throw new Meteor.Error('amount cannot be empty')
		}
		
		Groceries.insert({
			name,
			amount,
			grocerylistId,
			owner: this.userId,
			createdAt: new Date(),
		});
	},
	'groceries.remove'(groceryId) {
		check(groceryId, String);

		// Make sure only the owner can delete
		const grocery = Groceries.findOne(groceryId);
		if (grocery.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Groceries.remove(groceryId);
	},
	'groceries.moveList'(groceryId, grocerylistId) {
		check(groceryId, String);
		check(grocerylistId, String);

		Groceries.update({groceryId}, {$set: {grocerylistId}});
	},
	'groceries.setChecked'(groceryId, setChecked) {
		check(groceryId, String);
		check(setChecked, Boolean);

		const grocery = Groceries.findOne(groceryId);
		if (grocery.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Groceries.update(groceryId, { $set: { checked: setChecked } });
	},
});