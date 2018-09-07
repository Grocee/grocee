import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import chai from 'chai';
import { InventoryLists } from '/imports/api/inventorylists';
import { Inventories } from "./inventories";

describe('inventorylists.create', function () {
	const userId = Random.id();

	beforeEach(function() {
		InventoryLists.remove({});
	});

	it('can create inventory list', function () {
		const createList = Meteor.server.method_handlers['inventorylists.create'];
		const invocation = { userId };

		createList.apply(invocation, ['Pantry']);

		chai.assert.equal(InventoryLists.find().count(), 1);
	});

	it('fails if list name is empty', function () {
		chai.assert.throws(function () {
			const createList = Meteor.server.method_handlers['inventorylists.create'];
			const invocation = { userId };

			createList.apply(invocation, ['']);
		}, Meteor.Error, /Name cannot be empty/);
	})
});

describe('inventorylists.archive', function () {
	const userId = Random.id();
	let listId;

	beforeEach(function () {
		InventoryLists.remove({});
		listId = InventoryLists.insert({
			name: 'Stuff',
			owner: userId,
			items: []
		});
	});

	it('can archive owned inventory list', function () {
		const deleteInventoryList = Meteor.server.method_handlers['inventorylists.archive'];
		const invocation = { userId };

		deleteInventoryList.apply(invocation, [listId]);

		chai.assert.isTrue(InventoryLists.findOne({ _id: listId }).archived);
	});

	it('cannot archive others inventory list', function () {

		chai.assert.throws(function () {
			const deleteInventoryList = Meteor.server.method_handlers['inventorylists.archive'];
			const invocation = { userId: '123' };

			deleteInventoryList.apply(invocation, [listId]);
		}, Meteor.Error, 'not-authorized');

	});

	it('can archive each inventory item belonging to the list', function () {
		const deleteInventoryList = Meteor.server.method_handlers['inventorylists.archive'];
		const invocation = { userId };

		let itemId1 = Inventories.insert({
			name: 'First Item',
			amount: '1 lb',
			archived: false,
			owner: userId
		});

		let itemId2 = Inventories.insert({
			name: 'Second Item',
			amount: '1 lb',
			archived: false,
			owner: userId
		});

		InventoryLists.update(listId, { $set: { items: [itemId1, itemId2] } });

		deleteInventoryList.apply(invocation, [listId]);

		let list = InventoryLists.findOne({ _id: listId });
		chai.assert.isTrue(list.archived);

		list.items.forEach((itemId) => {
			chai.assert.isTrue(Inventories.findOne({ _id: itemId }).archived);
		})
	});
});

describe('inventorylists.addItem', function () {
	const userId = Random.id();
	let itemId;

	beforeEach(function () {
		InventoryLists.remove({});
		Inventories.remove({});

		itemId = Inventories.insert({
			name: 'Something',
			owner: userId
		});
	});

	it('can add item to list', function () {

		let listId = InventoryLists.insert({
			name: 'More Stuff',
			owner: userId
		});

		const addItem =  Meteor.server.method_handlers['inventorylists.addItem'];
		const invocation = { userId };

		addItem.apply(invocation, [listId, itemId]);

		chai.assert.equal(InventoryLists.findOne({ _id: listId }).items[0], itemId);
	});

	it('cannot add a nonexistent item to a list', function () {

		let listId = InventoryLists.insert({
			name: 'Stuff',
			owner: userId
		});

		chai.assert.throws(function () {

			const addItem = Meteor.server.method_handlers['inventorylists.addItem'];
			const invocation = { userId };

			addItem.apply(invocation, [listId, 'asdfas']);

		}, Meteor.Error, /Item does not exist/);

	});
});

describe('inventorylists.removeItem', function () {
	const userId = Random.id();
	let itemId;

	beforeEach(function () {
		InventoryLists.remove({});
		Inventories.remove({});

		itemId = Inventories.insert({
			name: 'Something',
			owner: userId
		});
	});

	it('can remove item from list', function () {

		let listId = InventoryLists.insert({
			name: 'More Stuff',
			owner: userId,
			items: [itemId]
		});

		const removeItem =  Meteor.server.method_handlers['inventorylists.removeItem'];
		const invocation = { userId };

		removeItem.apply(invocation, [listId, itemId]);

		chai.assert.equal(InventoryLists.findOne({ _id: listId }).items.length, 0);
	});

	it('cannot remove others item from their list', function () {

		let listId = InventoryLists.insert({
			name: 'More Stuff',
			owner: '1234',
			items: [itemId]
		});

		chai.assert.throws(function () {

			const removeItem = Meteor.server.method_handlers['inventorylists.removeItem'];
			const invocation = { userId };

			removeItem.apply(invocation, [listId, itemId]);

		}, Meteor.Error, /not-authorized/);

	});

	it('cannot remove item from a nonexistent list', function () {

		chai.assert.throws(function () {

			const removeItem = Meteor.server.method_handlers['inventorylists.removeItem'];
			const invocation = { userId };

			removeItem.apply(invocation, ['asdf', itemId]);

		}, Meteor.Error, /List does not exist/);

	});

});

describe('inventorylists.setDefault', function () {
	const userId = Random.id();
	let listId;

	beforeEach(function () {
		InventoryLists.remove({});

		listId = InventoryLists.insert({
			name: 'NonDefaultList',
			owner: userId
		});
	});

	it('can set a list as default', function () {

		const setDefault =  Meteor.server.method_handlers['inventorylists.setDefault'];
		const invocation = { userId };

		setDefault.apply(invocation, [listId]);

		chai.assert.isTrue(InventoryLists.findOne({ _id: listId }).isDefault);
	});

	it('removes any default lists before setting a list as default', function () {

		let defaultListId1 = InventoryLists.insert({
			name: 'Already Default List',
			owner: userId,
			isDefault: true
		});

		let defaultListId2 = InventoryLists.insert({
			name: 'Another Already Default List',
			owner: userId,
			isDefault: true
		});

		const setDefault =  Meteor.server.method_handlers['inventorylists.setDefault'];
		const invocation = { userId };

		setDefault.apply(invocation, [listId]);

		chai.assert.isTrue(InventoryLists.findOne({ _id: listId }).isDefault);
		chai.assert.isFalse(InventoryLists.findOne({ _id: defaultListId1 }).isDefault);
		chai.assert.isFalse(InventoryLists.findOne({ _id: defaultListId2 }).isDefault);
	})

});