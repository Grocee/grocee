import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { authCheck } from '../../utils/authorization';
import { InventoryLists } from "./inventorylists";

export const Inventories = new Mongo.Collection('inventories');

// If use arrow function this.userId will return undefined
Meteor.publish('inventories', function() {
	return Inventories.find({ owner: this.userId }); //, { sort: { createdAt: -1 }});
});

Meteor.methods({
	'inventories.insert'(name, amount, listId) {
		check(name, String);
		check(listId, String);

		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		if (name.length === 0) {
			throw new Meteor.Error('Name cannot be empty')
		}

		authCheck(InventoryLists, this.userId, listId);

		const newItem = Inventories.insert({
			name: name.trim(),
			amount,
			owner: this.userId,
			archived: false,
			listId,
			createdAt: new Date(),
		});

		InventoryLists.update(listId, { $push: { items: newItem } });
	},
	'inventories.update'(itemId, name, listId, amount = null) {
		check(itemId, String);
		check(name, String);
		check(listId, String);

		if (itemId.length === 0) {
			throw new Meteor.Error('itemId cannot be empty')
		}

		if (name.length === 0) {
			throw new Meteor.Error('Name cannot be empty')
		}

		if (listId.length === 0) {
			throw new Meteor.Error('listId cannot be empty')
		}

		console.log(`itemId: ${listId}`);

		authCheck(InventoryLists, this.userId, listId);
		authCheck(Inventories, this.userId, itemId);

		if (amount != null) {
			amount = amount.trim();
		}

		Inventories.update(itemId, {
			$set: {
				name: name.trim(),
				amount,
				listId
			}
		});
	},
	'inventories.archive'(itemId, archived = true) {
		check(itemId, String);
		authCheck(Inventories, this.userId, itemId);
		Inventories.update(itemId, {
			$set: { archived }
		});

	}
});