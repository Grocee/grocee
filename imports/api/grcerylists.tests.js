import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
 
import { GroceryLists } from '/imports/api/grocerylists';

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