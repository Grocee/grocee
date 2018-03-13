import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '../imports/api/groceries';
import '../imports/api/inventories';
import '../imports/api/recipes';

Meteor.startup(() => {
	console.log('Meteor started!')
});
