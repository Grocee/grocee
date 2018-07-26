import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Inventories } from './inventories';
import { authCheck } from '../../utils/authorization';

export const InventoryLists = new Mongo.Collection('inventorylists');

Meteor.publish('inventorylists', function() {
	return InventoryLists.find({ owner: this.userId });
});

Meteor.methods({
	'inventorylists.create'(name) {
		check(name, String);

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		if (name.length === 0) {
			throw new Meteor.Error('Name cannot be empty')
		}

		return InventoryLists.insert({
			name: name.trim(),
			owner: this.userId,
			items: [],
			createdAt: new Date()
		})
	},
	'inventorylists.remove'(listId) {
		check(listId, String);
		authCheck(InventoryLists, this.userId, listId);

		InventoryLists.remove(listId);
	},
	'inventorylists.addItem'(listId, itemId) {
		check(listId, String);
		check(itemId, String);
		authCheck(InventoryLists, this.userId, listId);
		
		// check if item exists
		const item = Inventories.findOne(itemId);
		if (!item) {
			throw new Meteor.Error('Item does not exist')
		}

		authCheck(Inventories, this.userId, itemId);

		InventoryLists.update(listId, { $push: { items: itemId } })
	},
	'inventorylists.removeItem'(listId, itemId) {
		check(listId, String);
		check(itemId, String);

		const list = InventoryLists.findOne(listId);
		if (!list) {
			throw new Meteor.Error('List does not exist')
		}

		authCheck(InventoryLists, this.userId, listId);

		const items = list.items.filter(item => item !== itemId);

		InventoryLists.update(listId, { $set: { items }});
	},
	'inventorylists.setDefault'(listId, isDefault) {
		check(listId, String);

		const list = InventoryLists.findOne(listId);
		if (!list) {
			throw new Meteor.Error('List does not exist')
		}

		authCheck(InventoryLists, this.userId, listId);

		InventoryLists.update(listId, { $set: { isDefault: isDefault }});
	},
})