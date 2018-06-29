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
		name = name.trim();
		
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
		return GroceryLists.update(groceryListId, { $set: { items }});
	},
	'grocerylists.remove'(groceryListId) {
		check(groceryListId, String);
        
		// Make sure only the owner can delete
		const groceryList = GroceryLists.findOne(groceryListId);
		if (groceryList.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		return GroceryLists.remove(groceryListId);
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
        
		return GroceryLists.update(groceryListId, { $set: { items }});
	}
});

// TODO move item to new list
// TODO add validation