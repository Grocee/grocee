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

	[null, ""].forEach((name) => {
		it('cannot insert grocery if name is empty', () => {
			const insertGrocery = Meteor.server.method_handlers['groceries.insert'];
			const invocation = { userId };
	
			assert.throws((() => {
				insertGrocery.apply(invocation, [name, '5']);
			}));
		});
	});

	it('can insert grocery even if amount is not provided', () => {
		const insertGrocery = Meteor.server.method_handlers['groceries.insert'];
		const invocation = { userId };

		insertGrocery.apply(invocation, ['Banana']);
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
		const invocation = { userId: `${userId}xxx` };

		assert.throws(() => {
			deleteGrocery.apply(invocation, [groceryId]);
		});
	});

	it('returns error if grocery item id is not passed', () => {
		const deleteGrocery = Meteor.server.method_handlers['groceries.remove'];
		const invocation = { userId };

		assert.throws(() => {
			deleteGrocery.apply(invocation, []);
		});
	});

	it('returns error if grocery item id is empty', () => {
		const deleteGrocery = Meteor.server.method_handlers['groceries.remove'];
		const invocation = { userId };

		assert.throws(() => {
			deleteGrocery.apply(invocation, [""]);
		});
	});
});

// 'groceries.archive'(groceryId, archived = true)
describe('groceries.archive', () => {
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
			archived: false
		});
	});

	it('can archive owned grocery', () => {
		const archiveGrocery = Meteor.server.method_handlers['groceries.archive'];
		const invocation = { userId };

		archiveGrocery.apply(invocation, [groceryId, true]);
		const grocery = Groceries.findOne(groceryId);
		assert.equal(grocery.archived, true);
	});

	it('sets archived to true when not passing archived parameter', () => {
		const archiveGrocery = Meteor.server.method_handlers['groceries.archive'];
		const invocation = { userId };

		archiveGrocery.apply(invocation, [groceryId]);
		const grocery = Groceries.findOne(groceryId);
		assert.equal(grocery.archived, true);
	});

	it('sets archived to false when archived parameter is set to false', () => {
		const archiveGrocery = Meteor.server.method_handlers['groceries.archive'];
		const invocation = { userId };

		archiveGrocery.apply(invocation, [groceryId, false]);
		const grocery = Groceries.findOne(groceryId);
		assert.equal(grocery.archived, false);
	});

	it('cannot archive others grocery', () => {
		const archiveGrocery = Meteor.server.method_handlers['groceries.archive'];
		const invocation = { userId: `${userId}xxx` };

		assert.throws(() => {
			archiveGrocery.apply(invocation, [groceryId]);
		});
	});

	it('returns an error if grocery id passed is empty', () => {
		const archiveGrocery = Meteor.server.method_handlers['groceries.archive'];
		const invocation = { userId };

		assert.throws(() => {
			archiveGrocery.apply(invocation, ['']);
		});
	});

	it('returns an error if no grocery id is passed', () => {
		const archiveGrocery = Meteor.server.method_handlers['groceries.archive'];
		const invocation = { userId };

		assert.throws(() => {
			archiveGrocery.apply(invocation, []);
		});
	});
});

describe('groceries.setChecked', () => {
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
			archived: false,
			checked: false
		});
	});

	[true, false].forEach((setChecked) => {
		it(`can set checked property to ${setChecked}`, () => {
			const setCheckedGrocery = Meteor.server.method_handlers['groceries.setChecked'];
			const invocation = { userId };
	
			setCheckedGrocery.apply(invocation, [groceryId, setChecked]);
			const grocery = Groceries.findOne(groceryId);
			assert.equal(grocery.checked, setChecked);
		});
	});

	it('cannot modify checked property of others grocery', () => {
		const setCheckedGrocery = Meteor.server.method_handlers['groceries.setChecked'];
		const invocation = { userId: `${userId}xxx` };

		assert.throws(() => {
			setCheckedGrocery.apply(invocation, [groceryId, true]);
		});
	});

	it('returns an error when no checked parameter is passed', () => {
		const setCheckedGrocery = Meteor.server.method_handlers['groceries.setChecked'];
		const invocation = { userId };

		assert.throws(() => {
			setCheckedGrocery.apply(invocation, [groceryId]);
		});
	});

	it('returns an error when grocery item ID is not passed', () => {
		const setCheckedGrocery = Meteor.server.method_handlers['groceries.setChecked'];
		const invocation = { userId };

		assert.throws(() => {
			setCheckedGrocery.apply(invocation, []);
		});
	});

	it('returns an error when grocery item ID is empty', () => {
		const setCheckedGrocery = Meteor.server.method_handlers['groceries.setChecked'];
		const invocation = { userId };

		assert.throws(() => {
			setCheckedGrocery.apply(invocation, [""]);
		});
	});
});

describe('groceries.updateName', () => {
	const userId = Random.id();
	let groceryId;
	const newName = "Basmati Rice";

	beforeEach(() => {
		Groceries.remove({});
		groceryId = Groceries.insert({
			name: 'Jasmine Rice',
			amount: '25 lbs',
			owner: userId,
			username: 'tcook',
			createdAt: new Date(),
			archived: false,
			checked: false
		});
	});

	it('can update the name of a grocery item', () => {
		const updateNameGrocery = Meteor.server.method_handlers['groceries.updateName'];
		const invocation = { userId };

		updateNameGrocery.apply(invocation, [groceryId, newName]);
		const grocery = Groceries.findOne(groceryId);
		assert.equal(grocery.name, newName);
	});

	it('cannot update name of other grocery item', () => {
		const updateNameGrocery = Meteor.server.method_handlers['groceries.updateName'];
		const invocation = { userId: `${userId}xxx` };

		assert.throws(() => {
			updateNameGrocery.apply(invocation, [groceryId, newName]);
		});
	});

	it('returns an error when no name parameter is passed', () => {
		const updateNameGrocery = Meteor.server.method_handlers['groceries.updateName'];
		const invocation = { userId };

		assert.throws(() => {
			updateNameGrocery.apply(invocation, [groceryId]);
		});
	});

	it('returns an error when grocery item ID is not passed', () => {
		const updateNameGrocery = Meteor.server.method_handlers['groceries.updateName'];
		const invocation = { userId };

		assert.throws(() => {
			updateNameGrocery.apply(invocation, []);
		});
	});

	it('returns an error when grocery item ID is empty', () => {
		const updateNameGrocery = Meteor.server.method_handlers['groceries.updateName'];
		const invocation = { userId };

		assert.throws(() => {
			updateNameGrocery.apply(invocation, [""]);
		});
	});
});

describe('groceries.updateAmount', () => {
	const userId = Random.id();
	let groceryId;
	const newAmount = "5 lbs";

	beforeEach(() => {
		Groceries.remove({});
		groceryId = Groceries.insert({
			name: 'Jasmine Rice',
			amount: '25 lbs',
			owner: userId,
			username: 'tcook',
			createdAt: new Date(),
			archived: false,
			checked: false
		});
	});

	it('can update the amount of a grocery item', () => {
		const updateAmountGrocery = Meteor.server.method_handlers['groceries.updateAmount'];
		const invocation = { userId };

		updateAmountGrocery.apply(invocation, [groceryId, newAmount]);
		const grocery = Groceries.findOne(groceryId);
		assert.equal(grocery.amount, newAmount);
	});

	it('cannot update amount of other grocery item', () => {
		const updateAmountGrocery = Meteor.server.method_handlers['groceries.updateAmount'];
		const invocation = { userId: `${userId}xxx` };

		assert.throws(() => {
			updateAmountGrocery.apply(invocation, [groceryId, newAmount]);
		});
	});

	it('returns an error when no amount parameter is passed', () => {
		const updateAmountGrocery = Meteor.server.method_handlers['groceries.updateAmount'];
		const invocation = { userId };

		assert.throws(() => {
			updateAmountGrocery.apply(invocation, [groceryId]);
		});
	});

	it('returns an error when grocery item ID is not passed', () => {
		const updateAmountGrocery = Meteor.server.method_handlers['groceries.updateAmount'];
		const invocation = { userId };

		assert.throws(() => {
			updateAmountGrocery.apply(invocation, []);
		});
	});

	it('returns an error when grocery item ID is empty', () => {
		const updateAmountGrocery = Meteor.server.method_handlers['groceries.updateAmount'];
		const invocation = { userId };

		assert.throws(() => {
			updateAmountGrocery.apply(invocation, [""]);
		});
	});
});