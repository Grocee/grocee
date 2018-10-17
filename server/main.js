import { Meteor } from 'meteor/meteor';

import '../imports/api/groceries';
import '../imports/api/grocerylists';
import '../imports/api/inventories';
import '../imports/api/inventorylists';
import '../imports/api/recipes';
import '../imports/api/accounts';

Meteor.startup(() => {
	console.log('Meteor started!'); // eslint-disable-line
});
