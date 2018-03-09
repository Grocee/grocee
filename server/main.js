import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '../imports/api/groceries';
import '../imports/api/inventories';
import '../imports/api/recipes';

Meteor.startup(() => {
	// code to run on server at startup
	Accounts.onCreateUser((options, user) => {
		user.username = options.username;
		return user;
	});
});
