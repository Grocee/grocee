import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('Meteor.users.names', function () {
	if (this.userId) {
		return Meteor.users.find({ _id: this.userId }, {
			fields: { firstName: 1, lastName: 1 }
		})
	} else {
		this.ready()
	}
});

Meteor.methods({
	'accounts.updateNames'(newFirstName, newLastName) {
		check(newFirstName, String);
		check(newLastName, String);

		Meteor.users.update({ _id: this.userId }, {
			$set: {
				firstName: newFirstName,
				lastName: newLastName
			}
		});
	},
});