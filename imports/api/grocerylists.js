import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { authCheck } from '../../utils/authorization';

export const GroceryLists = new Mongo.Collection('grocerylists');

Meteor.publish('grocerylists', function() {
	return GroceryLists.find({ owner: this.userId });
});

Meteor.methods({
	'grocerylists.create'(name) {
		check(name, String);

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		if (name.length === 0) {
			throw new Meteor.Error('name cannot be empty')
		}
		
		return GroceryLists.insert({
			name: name.trim(),
			owner: this.userId,
			createdAt: new Date(),
			items: []
		});
	},
	'grocerylists.addItem'(groceryListId, groceryItemId) {
		check(groceryListId, String);
		check(groceryItemId, String);
		authCheck(GroceryLists, this.userId, groceryListId);

		const groceryList = GroceryLists.findOne(groceryListId);
		const items = groceryList.items;
		items.push(groceryItemId);

		return GroceryLists.update(groceryListId, { $set: { items }});
	},
	'grocerylists.remove'(groceryListId) {
		check(groceryListId, String);
		authCheck(GroceryLists, this.userId, groceryListId);
		
		return GroceryLists.remove(groceryListId);
	},
	'grocerylists.removeItem'(groceryListId, groceryItemId) {
		check(groceryListId, String);
		check(groceryItemId, String);
		authCheck(GroceryLists, this.userId, groceryListId);

		const groceryList = GroceryLists.findOne(groceryListId);
		const items = groceryList.items.filter(groceryItem => groceryItem !== groceryItemId);
        
		return GroceryLists.update(groceryListId, {
			$set: { items }
		});
	},
	'grocerylists.moveItem'(groceryItemId, currentGroceryListId, newGroceryListId) {
		check(groceryItemId, String);
		check(currentGroceryListId, String);
		check(newGroceryListId, String);
		authCheck(GroceryLists, this.userId, currentGroceryListId);
		authCheck(GroceryLists, this.userId, newGroceryListId);

		// Remove from existing grocery list first
		const currentGroceryList = GroceryLists.findOne(currentGroceryListId);
		const currentGroceryListItems = currentGroceryList.items.filter(groceryItem => groceryItem !== groceryItemId);
		GroceryLists.update(currentGroceryListId, {
			$set: { items: currentGroceryListItems }
		});

		const groceryList = GroceryLists.findOne(newGroceryListId);
		const items = groceryList.items;
		items.push(groceryItemId);
		return GroceryLists.update(newGroceryListId, {
			$set: { items }
		});
	}
});