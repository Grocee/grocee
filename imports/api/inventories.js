import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { authCheck } from '../../utils/authorization';
import { InventoryLists } from "./inventorylists";

const Inventories = new Mongo.Collection('inventories');

// If use arrow function this.userId will return undefined
Meteor.publish('inventories', function() {
	return Inventories.find({ owner: this.userId }); //, { sort: { createdAt: -1 }});
});

const insertInventory = (name, userId, amount, listId, archived = false, callback) => {
	if (callback) {
		Inventories.insert({
			name: name.trim(),
			amount,
			owner: userId,
			archived,
			listId,
			createdAt: new Date(),
		}, callback);
	} else {
		return Inventories.insert({
			name: name.trim(),
			amount,
			owner: userId,
			archived,
			listId,
			createdAt: new Date(),
		});
	}
}

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

		const newItem = insertInventory(name, this.userId, amount, listId, false);
		InventoryLists.update(listId, { $push: { items: newItem } });
	},
	'inventories.update'(itemId, name, amount = null) {
		check(itemId, String);

		if (itemId.length === 0) {
			throw new Meteor.Error('itemId cannot be empty')
		}

		if (name.length === 0) {
			throw new Meteor.Error('Name cannot be empty')
		}

		authCheck(Inventories, this.userId, itemId);

		if (amount != null) {
			amount = amount.trim();
		}

		Inventories.update(itemId, {
			$set: {
				name: name.trim(),
				amount
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

export { Inventories, insertInventory };
