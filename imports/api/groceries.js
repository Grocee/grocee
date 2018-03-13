import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Groceries = new Mongo.Collection('groceries');

Meteor.publish('groceries', function() {
	return Groceries.find({ owner: this.userId });
});

Meteor.methods({
	'groceries.insert'(name, amount) {
		check(name, String);
		check(amount, String);

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
			name: name,
			amount: amount,
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