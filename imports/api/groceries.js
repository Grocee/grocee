import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { authCheck } from '../../utils/authorization';
 
export const Groceries = new Mongo.Collection('groceries');
import { insertInventory } from './inventories';
import { addItemToList, getDefaultList } from './inventorylists';

Meteor.publish('groceries', function() {
	return Groceries.find({ owner: this.userId });
});

Meteor.methods({
	'groceries.insert'(name, amount) {
		check(name, String);

		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		if (name.length === 0) {
			throw new Meteor.Error('name cannot be empty')
		}
		
		const newGrocery = {
			name: name.trim(),
			checked: false,
			archived: false,
			owner: this.userId,
			createdAt: new Date(),
		};
		if (amount && amount !== "") {
			newGrocery.amount = amount.trim();
		}

		return Groceries.insert(newGrocery);
	},
	'groceries.remove'(groceryId) {
		check(groceryId, String);
		authCheck(Groceries, this.userId, groceryId);

		return Groceries.remove(groceryId);
	},
	'groceries.archive'(groceryId, archived = true) {
		check(groceryId, String);
		authCheck(Groceries, this.userId, groceryId);

		return Groceries.update(groceryId, {
			$set: { archived }
		});
	},
	'groceries.setChecked'(groceryId, setChecked, addToInventory = true) {
		check(groceryId, String);
		check(setChecked, Boolean);
		authCheck(Groceries, this.userId, groceryId);

		if (!addToInventory) {
			return Groceries.update(groceryId, {
				$set: { checked: setChecked }
			});
		} else {
			Groceries.update(groceryId, {
				$set: { checked: setChecked }
			});
	
			const grocery = Groceries.findOne(groceryId);
			const defaultInventoryList = getDefaultList();
			insertInventory(grocery.name, this.userId, grocery.amount, defaultInventoryList._id, false, (insertErr, insertedInventory) => {
				if (insertErr) {
					throw new Meteor.Error('Unable to create new Inventory item');
				}
				
				return addItemToList(insertedInventory);
			});
		}
	},
	'groceries.updateName'(groceryId, name) {
		check(groceryId, String);
		check(name, String);
		authCheck(Groceries, this.userId, groceryId);

		return Groceries.update({ _id: groceryId }, {
			$set: { name: name.trim() }
		});
	},
	'groceries.updateAmount'(groceryId, amount) {
		check(groceryId, String);
		check(amount, String);
		authCheck(Groceries, this.userId, groceryId);

		return Groceries.update({ _id: groceryId }, {
			$set: { amount: amount.trim() }
		});
	}
});