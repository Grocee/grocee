import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { authCheck } from '../../utils/authorization';

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
			throw new Meteor.Error('Name cannot be empty')
		}

		return Inventories.insert({
			name: name.trim(),
			owner: this.userId,
			createdAt: new Date(),
		});

	},
	'inventories.updateName'(itemId, newName) {
		check(itemId, String);
		check(newName, String);

		if (newName.length === 0) {
			throw new Meteor.Error('Name cannot be empty')
		}

		authCheck(Inventories, this.userId, itemId);

		Inventories.update({ _id: itemId }, { $set: { name: newName.trim() }});
	},
	'inventories.updateAmount'(itemId, amount) {
		check(itemId, String);

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		if (itemId.length === 0) {
			throw new Meteor.Error('itemId cannot be empty')
		}

		authCheck(Inventories, this.userId, itemId);
		Inventories.update({ _id: itemId }, { $set: { amount: amount.trim() }});
	},
	'inventories.remove'(itemId) {
		check(itemId, String);
		authCheck(Inventories, this.userId, itemId);
		Inventories.remove(itemId);
	},
});