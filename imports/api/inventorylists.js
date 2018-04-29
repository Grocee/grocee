import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Inventories } from './inventories';

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
			throw new Meteor.Error('name cannot be empty')
		}

		InventoryLists.insert({
			name,
			owner: this.userId,
			items: [],
			createdAt: new Date()
		})
	},
	'inventorylists.remove'(listId) {
		check(listId, String);

		// Make sure only the owner can remove
		const list = InventoryLists.findOne(listId);
		if (list.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		InventoryLists.remove(listId);
	},
	'inventorylists.addItem'(listId, itemId) {
		check(listId, String);
		check(itemId, String);

		// only owner can add item to list
		const list = InventoryLists.findOne(listId);
		if (list.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		// check if item exists
		const item = Inventories.findOne(itemId);
		if (!item) {
			throw new Meteor.Error('item does not exist')
		}

		// push method to add to list
		InventoryLists.update(listId, { $push: { items: itemId } })
	}
})