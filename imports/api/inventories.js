import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Inventories = new Mongo.Collection('inventories');

if (Meteor.isServer) {
	Meteor.publish('inventories', function taskPublication() {
		return Inventories.find();
	});
}

Meteor.methods({
	'inventories.insert'(name, amount) {
		check(name, String);
		check(amount, String);

		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}		
		
		Inventories.insert({
			name: name,
			amount: amount,
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
			createdAt: new Date(),
		});
	},
	'inventories.remove'(itemId) {
		check(itemId, String);

		// Make sure only the owner can delete
		const inventory = Inventories.findOne(itemId);
		if (inventory.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Inventories.remove(itemId);
	},
});