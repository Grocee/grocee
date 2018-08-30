import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
 
import { GroceryLists } from '/imports/api/grocerylists';

describe('grocerylists.create', () => {
	const userId = Random.id();
	const newGroceryListName = "Pet Supplies";

	beforeEach(() => {
		GroceryLists.remove({});
		GroceryLists.insert({
			name: 'Fruits',
			owner: userId,
			createdAt: new Date(),
			items: ['groceryItemId']
		});
	});

	it('can create new grocery list', () => {
		const createGroceryList = Meteor.server.method_handlers['grocerylists.create'];
		const invocation = { userId };

		createGroceryList.apply(invocation, [newGroceryListName]);
		assert.equal(GroceryLists.find().count(), 2);
	});

	[null, ""].forEach((name) => {
		it('cannot create grocery list if name is empty', () => {
			const insertGrocery = Meteor.server.method_handlers['grocerylists.create'];
			const invocation = { userId };
	
			assert.throws((() => {
				insertGrocery.apply(invocation, [name]);
			}));
		});
	});
});

describe('grocerylists.addItem', () => {
	const userId = Random.id();
	let groceryListId;
	let otherGroceryListId;
	const groceryItemId = "abcd1234";
	const otherGroceryItemId = "xyz789";

	const addItem = Meteor.server.method_handlers['grocerylists.addItem'];
	const invocation = { userId };

	beforeEach(() => {
		GroceryLists.remove({});
		groceryListId = GroceryLists.insert({
			name: 'Fruits',
			owner: userId,
			createdAt: new Date(),
			items: [otherGroceryItemId]
		});
		otherGroceryListId = GroceryLists.insert({
			name: 'Pet Supplies',
			owner: `${userId}xxx`,
			createdAt: new Date(),
			items: []
		});
	});

	it('can add grocery item to owned grocery list', () => {
		addItem.apply(invocation, [groceryListId, groceryItemId]);
		const groceryList = GroceryLists.findOne(groceryListId);
		assert.equal(groceryList.items.length, 2);
		assert.deepEqual(groceryList.items, [otherGroceryItemId, groceryItemId]);
	});

	it('cannot add grocery item to other grocery list', () => {
		assert.throws(() => {
			addItem.apply(invocation, [otherGroceryListId, groceryItemId]);
		});
	});

	it('cannot add grocery item that already exists', () => {
		assert.throws(() => {
			addItem.apply(invocation, [groceryListId, otherGroceryItemId]);
		});
	});

	it('returns an error when no grocery item id is passed', () => {
		assert.throws(() => {
			addItem.apply(invocation, [groceryListId])
		});
	});
});

describe('grocerylists.updateName', () => {
	const userId = Random.id();
	let groceryListId;
	const groceryItemId = "abcd1234";
	const newGroceryListName = "Vegetables";

	const updateName = Meteor.server.method_handlers['grocerylists.updateName'];
	const invocation = { userId };

	beforeEach(() => {
		GroceryLists.remove({});
		groceryListId = GroceryLists.insert({
			name: 'Fruits',
			owner: userId,
			createdAt: new Date(),
			items: [groceryItemId]
		});
	});

	it('can update name of owned grocery list', () => {
		updateName.apply(invocation, [groceryListId, newGroceryListName]);
		const groceryList = GroceryLists.findOne(groceryListId);
		assert.equal(groceryList.name, newGroceryListName);
	});

	["", 2, null].forEach(newName => {
		it('new list name must be a non-empty string', () => {
			assert.throws(() => {
				updateName.apply(invocation, [groceryListId, newName]);
			});
		});
	});
});

describe('grocerylists.remove', () => {
	const userId = Random.id();
	let groceryListId;
	let otherGroceryListId;

	const removeList = Meteor.server.method_handlers['grocerylists.remove'];
	const invocation = { userId };

	beforeEach(() => {
		GroceryLists.remove({});
		groceryListId = GroceryLists.insert({
			name: 'Fruits',
			owner: userId,
			createdAt: new Date(),
			items: []
		});
		otherGroceryListId = GroceryLists.insert({
			name: 'Pet Supplies',
			owner: `${userId}xxx`,
			createdAt: new Date(),
			items: []
		});
	});

	it('can remove a grocery list', () => {
		removeList.apply(invocation, [groceryListId]);
		assert.equal(GroceryLists.find().count(), 1);
		assert.equal(GroceryLists.findOne(groceryListId), undefined);
	});

	it('cannot remove other grocery list', () => {
		assert.throws(() => {
			removeList.apply(invocation, [otherGroceryListId]);
		});
	});

	it('returns an error when no grocery list id is passed', () => {
		assert.throws(() => {
			removeList.apply(invocation, []);
		});
	});
});

describe('grocerylists.removeItem', () => {
	const userId = Random.id();
	let groceryListId;
	let otherGroceryListId;
	const groceryItemId = "abcd1234";

	const removeItem = Meteor.server.method_handlers['grocerylists.removeItem'];
	const invocation = { userId };

	beforeEach(() => {
		GroceryLists.remove({});
		groceryListId = GroceryLists.insert({
			name: 'Fruits',
			owner: userId,
			createdAt: new Date(),
			items: [groceryItemId]
		});
		otherGroceryListId = GroceryLists.insert({
			name: 'Pet Supplies',
			owner: `${userId}xxx`,
			createdAt: new Date(),
			items: []
		});
	});

	it('can remove a grocery item from grocery list', () => {
		removeItem.apply(invocation, [groceryListId, groceryItemId]);
		const groceryList = GroceryLists.findOne(groceryListId);
		assert.equal(groceryList.items.length, 0);
		assert.deepEqual(groceryList.items, []);
	});

	it('cannot remove grocery item from other grocery list', () => {
		assert.throws(() => {
			removeItem.apply(invocation, [otherGroceryListId, groceryItemId]);
		});
	});

	it('returns an error when no grocery item id is passed', () => {
		assert.throws(() => {
			removeItem.apply(invocation, [groceryListId]);
		});
	});
});

describe('grocerylists.moveItem', () => {
	const userId = Random.id();
	let groceryListId;
	let newGroceryListId;
	let otherGroceryListId;

	beforeEach(() => {
		GroceryLists.remove({});
		groceryListId = GroceryLists.insert({
			name: 'Fruits',
			owner: userId,
			createdAt: new Date(),
			items: ['groceryItemId']
		});
		newGroceryListId = GroceryLists.insert({
			name: 'Other Fruits',
			owner: userId,
			createdAt: new Date(),
			items: []
		});
		otherGroceryListId = GroceryLists.insert({
			name: 'Others',
			owner: `${userId}xxx`,
			createdAt: new Date(),
			items: []
		});
	});

	it('can move grocery item from owned grocery list to owned grocery list', () => {
		const moveItem = Meteor.server.method_handlers['grocerylists.moveItem'];
		const invocation = { userId };
		moveItem.apply(invocation, ['groceryItemId', groceryListId, newGroceryListId]);
		
		const oldGroceryList = GroceryLists.findOne(groceryListId);
		assert.deepEqual(oldGroceryList.items, []);

		const newGroceryList = GroceryLists.findOne(newGroceryListId);
		assert.deepEqual(newGroceryList.items, ['groceryItemId'])
	});

	it('cannot move grocery item from owned grocery list to other grocery list', () => {
		const moveItem = Meteor.server.method_handlers['grocerylists.moveItem'];
		const invocation = { userId };
		assert.throws(() => {
			moveItem.apply(invocation, ['groceryItemId', groceryListId, otherGroceryListId]);
		}, Meteor.Error, 'not-authorized');
	});

	it('cannot move grocery item from other grocery list to owned grocery list', () => {
		const moveItem = Meteor.server.method_handlers['grocerylists.moveItem'];
		const invocation = { userId };
		assert.throws(() => {
			moveItem.apply(invocation, ['groceryItemId', otherGroceryListId, newGroceryListId]);
		}, Meteor.Error, 'not-authorized');
	});
});