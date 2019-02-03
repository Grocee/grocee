import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import App from '../imports/ui/App';
import { Accounts } from "meteor/accounts-base";
import { Session } from 'meteor/session';

Meteor.startup(() => {
	ReactDOM.render(<App />, document.getElementById('render-target'));
});

Accounts.onEmailVerificationLink((token, done) => {
	console.log('Verifying email with token: ' + token); // eslint-disable-line
	Session.set('verifyEmailToken', token);
});

Accounts.onResetPasswordLink((token, done) => {
	console.log('Resetting password with token: ' + token); // eslint-disable-line
	Session.set('resetPasswordToken', token)
});