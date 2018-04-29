import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

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
			name,
			owner: this.userId,
			createdAt: new Date(),
			items: []
		});
	},
	'grocerylists.addItem'(groceryListId, groceryItemId) {
		check(groceryListId, String);
		check(groceryItemId, String);

		const groceryList = GroceryLists.findOne(groceryListId);
		if ( groceryList.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const items = groceryList.items;
		items.push(groceryItemId);
		GroceryLists.update(groceryListId, { $set: { items }});
	},
	'grocerylists.remove'(groceryListId) {
		check(groceryListId, String);
        
		// Make sure only the owner can delete
		const groceryList = GroceryLists.findOne(groceryListId);
		if (groceryList.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		GroceryLists.remove(groceryListId);
	},
	'grocerylists.removeItem'(groceryListId, groceryItemId) {
		check(groceryListId, String);
		check(groceryItemId, String);

		// Make sure only the owner can delete
		const groceryList = GroceryLists.findOne(groceryListId);
		if (groceryList.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
        
		const items = groceryList.items.filter(groceryItem => groceryItem !== groceryItemId);
        
		GroceryLists.update(groceryListId, { $set: { items }});
	}
});