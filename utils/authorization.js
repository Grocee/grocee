import { Meteor } from 'meteor/meteor';

const authCheck = (collection, userId, groceryId) => {
	// Make sure only the owner can delete
	const grocery = collection.findOne(groceryId);
	if (grocery.owner !== userId) {
		throw new Meteor.Error('not-authorized');
	}
}

export { authCheck };