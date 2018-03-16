import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Inventories = new Mongo.Collection('inventories');

// If use arrow function this.userId will return undefined
Meteor.publish('inventories', function() {
	return Inventories.find({ owner: this.userId }); //, { sort: { createdAt: -1 }});
});

Meteor.methods({
	'inventories.insert'(name) {
		check(name, String);

		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		if (name.length === 0) {
			throw new Meteor.Error('name cannot be empty')
		}

		Inventories.insert({
			name: name,
			owner: this.userId,
			createdAt: new Date(),
		});
	},
	'inventories.updateAmount'(itemId, amount) {
		check(itemId, String);
		check(amount, String);

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		if (itemId.length === 0) {
			throw new Meteor.Error('itemId cannot be empty')
		}

		if (amount.length === 0) {
			throw new Meteor.Error('amount cannot be empty')
		}

		Inventories.update({_id: itemId}, {$set: {amount: amount}});

	},
	'inventories.remove'(itemId) {
		check(itemId, String);

		const inventory = Inventories.findOne(itemId);
		if (inventory.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Inventories.remove(itemId);
	},
});