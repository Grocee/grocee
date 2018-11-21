import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import VerifyEmail from '../imports/ui/VerifyEmail';
import {Accounts} from "meteor/accounts-base";

Meteor.startup(() => {
	//TODO: create proper main view?
	render(<VerifyEmail />, document.getElementById('render-target'));
});

Accounts.onEmailVerificationLink(function (token) {
	Accounts.verifyEmail(token);
	//TODO: create proper verify password page
});

Accounts.onResetPasswordLink(function (token) {
	console.log('Resetting password...');
	console.log('token: ' + token);
	//TODO: render reset password page, let user enter new password, then call Accounts.resetPassword
	// https://docs.meteor.com/api/passwords.html#Accounts-resetPassword
});