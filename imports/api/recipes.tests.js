import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import { Recipes } from '/imports/api/recipes';

describe('recipes.insert', () => {
	const userId = Random.id();

	beforeEach(() => {
		Recipes.remove({});
	});

	it('can insert recipe', () => {
		const insert = Meteor.server.method_handlers['recipes.insert'];
		const invocation = { userId };

		const name = 'Chicken Teriyaki';
		const url = 'https://www.chickenteriyakirecipe.com/';

		insert.apply(invocation, [name, url]);

		assert.equal(Recipes.find().count(), 1);

		const foundRecipe = Recipes.findOne();
		assert.equal(foundRecipe.name, name);
		assert.equal(foundRecipe.url, url)

	});

	[null, "", "name"].forEach((name) => {
		it('cannot insert recipe if name or url is empty', () => {
			const insert = Meteor.server.method_handlers['recipes.insert'];
			const invocation = { userId };

			[null, ""].forEach((url) => {
				assert.throws((() => {
					insert.apply(invocation, [name, url]);
				}));
			})
		});
	});
});

describe('recipes.remove', () => {
	const userId = Random.id();
	let recipeId;

	beforeEach(() => {
		Recipes.remove({});

		recipeId = Recipes.insert({
			name: 'Fried Rice',
			url: 'friedrice.com',
			owner: userId,
			createdAt: new Date(),
		});
	});

	it('can remove recipe', () => {
		const remove = Meteor.server.method_handlers['recipes.remove'];
		const invocation = { userId };

		remove.apply(invocation, [recipeId]);

		assert.equal(Recipes.find().count(), 0);
	});
});

describe('recipes.archive', () => {
	const userId = Random.id();
	let recipeId;

	beforeEach(() => {
		Recipes.remove({});

		recipeId = Recipes.insert({
			name: 'Panang Curry',
			url: 'test.com',
			owner: userId,
			createdAt: new Date(),
		});
	});

	it('can archive recipe', () => {
		const archive = Meteor.server.method_handlers['recipes.archive'];
		const invocation = { userId };

		archive.apply(invocation, [recipeId]);

		assert.isTrue(Recipes.findOne().archived);
	});
});

describe('recipes.update', () => {
	const userId = Random.id();
	let recipeId;

	beforeEach(() => {
		Recipes.remove({});

		recipeId = Recipes.insert({
			name: 'Old Recipe',
			url: 'test.com',
			owner: userId,
			createdAt: new Date(),
		});
	});

	it('can update recipe', () => {
		const update = Meteor.server.method_handlers['recipes.update'];
		const invocation = { userId };

		const newName = 'Ayam Goreng';
		const newURL =  'ayamgoreng.com';

		update.apply(invocation, [recipeId, newName, newURL]);

		const foundRecipe = Recipes.findOne();
		assert.equal(foundRecipe.name, newName);
		assert.equal(foundRecipe.url, newURL);
	});
});