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
		
		GroceryLists.insert({
			name,
			owner: this.userId,
			createdAt: new Date()
		});
	},
	'grocerylists.remove'(grocerylistId) {
		check(grocerylistId, String);
        
		// Make sure only the owner can delete
		const grocery = GroceryLists.findOne(grocerylistId);
		if (grocery.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		GroceryLists.remove(grocerylistId);
	}
});