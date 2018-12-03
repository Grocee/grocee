import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Inventories } from './inventories';
import { authCheck } from '../../utils/authorization';

const InventoryLists = new Mongo.Collection('inventorylists');

Meteor.publish('inventorylists', function() {
	return InventoryLists.find({ owner: this.userId });
});

const addItemToList = (itemId, listId) => {
	const listSelector = listId || { isDefault: true };
	return InventoryLists.update(
		listSelector,
		{ $push: { items: itemId } }
	);
}

const getDefaultList = () => {
	return InventoryLists.findOne({ isDefault: true });
}

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
	'inventorylists.archive'(listId, archived = true) {
		check(listId, String);
		authCheck(InventoryLists, this.userId, listId);

		const list = InventoryLists.findOne(listId);

		InventoryLists.update(listId, {
			$set: { archived }
		});

		list.items.forEach((itemId) => {
			Inventories.update(itemId, {
				$set: { archived }
			});
		});

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

		addItemToList(itemId, listId);
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
	'inventorylists.setDefault'(listId) {
		check(listId, String);

		const list = InventoryLists.findOne(listId);
		if (!list) {
			throw new Meteor.Error('List does not exist')
		}

		authCheck(InventoryLists, this.userId, listId);

		// find lists that might be set as default
		let lists = InventoryLists.find({ isDefault: true });

		lists.forEach(function (list) {
			InventoryLists.update(list._id, { $set: { isDefault: false }});
		});

		InventoryLists.update(listId, { $set: { isDefault: true }});
	},
	'inventorylists.moveItem'(itemId, currentListId, newListId) {
		check(itemId, String);
		check(currentListId, String);
		check(newListId, String);

		authCheck(InventoryLists, this.userId, currentListId);
		authCheck(InventoryLists, this.userId, newListId);

		const currentList = InventoryLists.findOne(currentListId);
		const currentListItems = currentList.items.filter(inventoryItem => inventoryItem !== itemId);
		InventoryLists.update(currentListId, {
			$set: { items: currentListItems }
		});

		Inventories.update(itemId, {
			$set: { listId: newListId }
		});

		return addItemToList(itemId, newListId);
	},
	'inventorylists.updateName'(inventoryListId, newName) {
		check(inventoryListId, String);
		check(newName, String);

		const trimmedName = newName.trim();
		if (trimmedName.length === 0) {
			throw new Meteor.Error('name cannot be empty');
		}

		authCheck(InventoryLists, this.userId, inventoryListId);

		return InventoryLists.update({ _id: inventoryListId }, {
			$set: { name: trimmedName }
		});
	}
});

export { InventoryLists, addItemToList, getDefaultList };