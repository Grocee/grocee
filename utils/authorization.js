import { Meteor } from 'meteor/meteor';

const authCheck = (collection, userId, id) => {
	// Make sure only the owner can delete
	const item = collection.findOne(id);
	if (item.owner !== userId) {
		throw new Meteor.Error('not-authorized');
	}
}

export { authCheck };