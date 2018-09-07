import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import chai from 'chai';
import { Inventories } from "./inventories";
import { InventoryLists } from "./inventorylists";

describe('inventories.insert', function () {
	const userId = Random.id();
	let listId;

	beforeEach(function() {
		Inventories.remove({});
		InventoryLists.remove({});
		listId = InventoryLists.insert({
			name: 'Stuff',
			owner: userId
		});
	});

	it('can create an inventory item', function () {

		const createInventoryItem = Meteor.server.method_handlers['inventories.insert'];
		const invocation = { userId };

		createInventoryItem.apply(invocation, ['rice', '', listId]);

		chai.assert.equal(Inventories.find().count(), 1);
	});

	it('fails if name is empty', function () {

		chai.assert.throws(function () {
			const createInventoryItem = Meteor.server.method_handlers['inventories.insert'];
			const invocation = { userId };

			createInventoryItem.apply(invocation, ['', '', listId]);
		}, Meteor.Error, 'Name cannot be empty');

	});

	it('trims item name', function () {

		const createInventoryItem = Meteor.server.method_handlers['inventories.insert'];
		const invocation = { userId };
		let itemName = ' bread ';

		createInventoryItem.apply(invocation, [itemName, '', listId]);

		chai.assert.equal(Inventories.findOne().name, itemName.trim());

	});
});

describe('inventories.update', function () {
	const userId = Random.id();
	let itemId;

	beforeEach(function() {
		Inventories.remove({});
		itemId = Inventories.insert({
			name: 'Old Name',
			amount: '1 lb',
			owner: userId
		});
	});


	it('fails if itemId is not passed in', function () {

		chai.assert.throws(function () {

			const updateAmount = Meteor.server.method_handlers['inventories.update'];
			const invocation = { userId };

			updateAmount.apply(invocation, ['', 'test']);

		}, Meteor.Error, 'itemId cannot be empty');

	});

	it('cannot update others inventory item', function () {

		chai.assert.throws(function () {

			const updateAmount = Meteor.server.method_handlers['inventories.update'];
			const invocation = { userId: '123' };

			updateAmount.apply(invocation, [itemId, 'test']);

		}, Meteor.Error, 'not-authorized');
	});

	it('can update an inventory item name', function () {

		const updateName = Meteor.server.method_handlers['inventories.update'];
		const invocation = { userId };
		const newName = 'New Name';

		updateName.apply(invocation, [itemId, newName]);

		chai.assert.equal(Inventories.findOne({ _id: itemId }).name, newName);
	});

	it('can update an inventory name and amount', function () {

		const updateName = Meteor.server.method_handlers['inventories.update'];
		const invocation = { userId };
		const newName = 'New Name';
		const newAmount = '2 tonnes';

		updateName.apply(invocation, [itemId, newName, newAmount]);

		const item = Inventories.findOne({ _id: itemId });
		chai.assert.equal(item.name, newName);
		chai.assert.equal(item.amount, newAmount);
	});

	it('fails if new item name is empty', function () {

		chai.assert.throws(function () {
			const updateName = Meteor.server.method_handlers['inventories.update'];
			const invocation = { userId };

			updateName.apply(invocation, [itemId, '']);
		}, Meteor.Error, 'Name cannot be empty');

	});

	it('trims new item name and amount', function () {

		const updateName = Meteor.server.method_handlers['inventories.update'];
		const invocation = { userId };
		let itemName = ' bread ';
		let itemAmount = ' 20 lbs ';

		updateName.apply(invocation, [itemId, itemName, itemAmount]);

		const item = Inventories.findOne({ _id: itemId });
		chai.assert.equal(item.name, itemName.trim());
		chai.assert.equal(item.amount, itemAmount.trim());
	});

	it('removes amount if none is passed in', function () {
		const updateName = Meteor.server.method_handlers['inventories.update'];
		const invocation = { userId };
		const newName = 'New Name';

		updateName.apply(invocation, [itemId, newName]);

		const item = Inventories.findOne({ _id: itemId });
		chai.assert.equal(item.name, newName);
		chai.assert.isNull(item.amount);
	})
});

describe('inventories.archive', function () {
	const userId = Random.id();
	let itemId;

	beforeEach(function() {
		Inventories.remove({});

		itemId = Inventories.insert({
			name: 'Salmon',
			owner: userId
		});
	});

	it('can archive an inventory item', function () {

		const removeItem = Meteor.server.method_handlers['inventories.archive'];
		const invocation = { userId };

		removeItem.apply(invocation, [itemId]);

		chai.assert.isTrue(Inventories.findOne({ _id: itemId }).archived);
	});

	it('cannot archive others inventory item', function () {

		chai.assert.throws(function () {

			const removeItem = Meteor.server.method_handlers['inventories.archive'];
			const invocation = { userId: 'blah' };

			removeItem.apply(invocation, [itemId]);

		}, Meteor.Error, 'not-authorized');
	});
});