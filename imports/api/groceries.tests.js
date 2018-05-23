import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
 
import { Groceries } from '/imports/api/groceries';

describe('groceries.insert', () => {
	const userId = Random.id();

	beforeEach(() => {
		Groceries.remove({});
	});

	it('can insert grocery', () => {
		const insertGrocery = Meteor.server.method_handlers['groceries.insert'];

		const invocation = { userId };

		insertGrocery.apply(invocation, ['Banana', '5']);

		assert.equal(Groceries.find().count(), 1);
	});
});

describe('groceries.remove', () => {
	const userId = Random.id();
	let groceryId;

	beforeEach(() => {
		Groceries.remove({});
		groceryId = Groceries.insert({
			name: 'Jasmine Rice',
			amount: '25 lbs',
			owner: userId,
			username: 'tcook',
			createdAt: new Date(),
		});
	});

	it('can delete owned grocery', () => {
		const deleteGrocery = Meteor.server.method_handlers['groceries.remove'];

		const invocation = { userId };

		deleteGrocery.apply(invocation, [groceryId]);

		assert.equal(Groceries.find().count(), 0);
	});

	it('cannot delete others grocery', () => {
		const deleteGrocery = Meteor.server.method_handlers['groceries.remove'];

		const invocation = { userId: 'xxx' };

		// check that this throws error
		// deleteGrocery.apply(invocation, [groceryId]);
	});
});