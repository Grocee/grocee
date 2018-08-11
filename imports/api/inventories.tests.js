import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import chai from 'chai';
import { Inventories } from "./inventories";

describe('inventories.insert', function () {
	const userId = Random.id();

	beforeEach(function() {
		Inventories.remove({});
	});

	it('can create an inventory item', function () {

		const createInventoryItem = Meteor.server.method_handlers['inventories.insert'];
		const invocation = { userId };

		createInventoryItem.apply(invocation, ['rice']);

		chai.assert.equal(Inventories.find().count(), 1);
	});

	it('fails if name is empty', function () {

		chai.assert.throws(function () {
			const createInventoryItem = Meteor.server.method_handlers['inventories.insert'];
			const invocation = { userId };

			createInventoryItem.apply(invocation, ['']);
		}, Meteor.Error, /Name cannot be empty/);

	});

	it('trims item name', function () {

		const createInventoryItem = Meteor.server.method_handlers['inventories.insert'];
		const invocation = { userId };
		let itemName = ' bread ';

		createInventoryItem.apply(invocation, [itemName]);

		chai.assert.equal(Inventories.findOne().name, itemName.trim());

	});
});

describe('inventories.updateName', function () {
	const userId = Random.id();
	let itemId;

	beforeEach(function() {
		Inventories.remove({});
		itemId = Inventories.insert({
			name: 'Old Name',
			owner: userId
		});
	});

	it('can update an inventory item name', function () {

		const updateName = Meteor.server.method_handlers['inventories.updateName'];
		const invocation = { userId };
		const newName = 'New Name';

		updateName.apply(invocation, [itemId, newName]);

		chai.assert.equal(Inventories.findOne({ _id: itemId }).name, newName);
	});

	it('fails if new item name is empty', function () {

		chai.assert.throws(function () {
			const updateName = Meteor.server.method_handlers['inventories.updateName'];
			const invocation = { userId };

			updateName.apply(invocation, [itemId, '']);
		}, Meteor.Error, /Name cannot be empty/);

	});

	it('trims new item name', function () {

		const updateName = Meteor.server.method_handlers['inventories.updateName'];
		const invocation = { userId };
		let itemName = ' bread ';

		updateName.apply(invocation, [itemId, itemName]);

		chai.assert.equal(Inventories.findOne({ _id: itemId }).name, itemName.trim());

	});
});

describe('inventories.updateAmount', function () {
	const userId = Random.id();
	let itemId;

	beforeEach(function() {
		Inventories.remove({});
		itemId = Inventories.insert({
			name: 'Chicken Thighs',
			owner: userId
		});
	});

	it('can update an inventory item amount', function () {

		const updateAmount = Meteor.server.method_handlers['inventories.updateAmount'];
		const invocation = { userId };

		const amount = '5 lbs';

		updateAmount.apply(invocation, [itemId, amount]);

		chai.assert.equal(Inventories.findOne({ _id: itemId }).amount, amount);
	});

	it('cannot update others inventory item', function () {

		chai.assert.throws(function () {

			const updateAmount = Meteor.server.method_handlers['inventories.updateAmount'];
			const invocation = { userId: '123' };

			updateAmount.apply(invocation, [itemId, '1 lbs']);

		}, Meteor.Error, /not-authorized/);

	});

	it('fails if itemId is not passed in', function () {

		chai.assert.throws(function () {

			const updateAmount = Meteor.server.method_handlers['inventories.updateAmount'];
			const invocation = { userId };

			updateAmount.apply(invocation, ['', '1 lbs']);

		}, Meteor.Error, /itemId cannot be empty/);

	});

	it('trims item amount', function () {

		const updateAmount = Meteor.server.method_handlers['inventories.updateAmount'];
		const invocation = { userId };

		let amount = '  25 tonnes       ';

		updateAmount.apply(invocation, [itemId, amount]);

		chai.assert.equal(Inventories.findOne({ _id: itemId }).amount, amount.trim());

	});
});

describe('inventories.remove', function () {
	const userId = Random.id();
	let itemId;

	beforeEach(function() {
		Inventories.remove({});

		itemId = Inventories.insert({
			name: 'Salmon',
			owner: userId
		});
	});

	it('can remove an inventory item', function () {

		const removeItem = Meteor.server.method_handlers['inventories.remove'];
		const invocation = { userId };

		removeItem.apply(invocation, [itemId]);

		chai.assert.equal(Inventories.find().count(), 0);
	});

	it('cannot remove others inventory item', function () {

		chai.assert.throws(function () {

			const removeItem = Meteor.server.method_handlers['inventories.remove'];
			const invocation = { userId: 'blah' };

			removeItem.apply(invocation, [itemId]);

		}, Meteor.Error, /not-authorized/);
	});
});