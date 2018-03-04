import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
 
import { Groceries } from '/imports/api/groceries';

describe('Groceries', () => {
	describe('methods', () => {

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

			const invocation = { userId }

			deleteGrocery.apply(invocation, [groceryId]);

			assert.equal(Groceries.find().count(), 0);
		});
	});
});