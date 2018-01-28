/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import { Groceries } from './groceries.js';

if (Meteor.isServer) {
	describe('Groceries', () => {
		describe('methods', () => {
			const userId = Random.id();
			let groceryId;

			beforeEach(() => {
				Groceries.remove({});
				groceryId = Groceries.insert({
					name: 'test grocery',
					createdAt: new Date(),
					owner: userId,
					username: 'test',
				});
			});

			// Doesn't really work since we don't have users yet
			it('can delete owned item', () => {
				const deleteGrocery = Meteor.server.method_handlers['groceries.remove'];

				const invocation = { userId };

				deleteGrocery.apply(invocation, [groceryId]);

				assert.equal(Groceries.find().count(), 0);
			});
		});
	});
}
