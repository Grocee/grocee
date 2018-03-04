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

		// TODO: also check for user
		
		Inventories.insert({
			name: name,
			amount: amount,
			createdAt: new Date(),
		});
	},
	'inventories.remove'(itemId) {
		check(itemId, String);

		Inventories.remove(itemId);
	},
});