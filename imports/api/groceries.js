import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Groceries = new Mongo.Collection('groceries');

Meteor.publish('groceries', function() {
	return Groceries.find({ owner: this.userId });
});

const authCheck = (groceryId) => {
	// Make sure only the owner can delete
	const grocery = Groceries.findOne(groceryId);
	if (grocery.owner !== this.userId) {
		throw new Meteor.Error('not-authorized');
	}
}

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
			name,
			amount,
			owner: this.userId,
			createdAt: new Date(),
		});
	},
	'groceries.remove'(groceryId) {
		check(groceryId, String);
		authCheck(groceryId);

		Groceries.remove(groceryId);
	},
	'groceries.setChecked'(groceryId, setChecked) {
		check(groceryId, String);
		check(setChecked, Boolean);
		authCheck(groceryId);

		Groceries.update(groceryId, { $set: { checked: setChecked } });
	},
	'groceries.updateName'(groceryId, name) {
		check(groceryId, String);
		check(name, String);
		authCheck(groceryId);

		try {
			Groceries.updateOne(
				{ _id: groceryId },
				{ $set: { name } }
			);
		} catch (e) {
			// TODO
		}
	},
	'groceries.updateAmount'(groceryId, amount) {
		check(groceryId, String);
		check(amount, String);
		authCheck(groceryId);

		try {
			Groceries.updateOne(
				{ _id: groceryId },
				{ $set: { name } }
			);
		} catch (e) {
			// TODO
		}
	}
});