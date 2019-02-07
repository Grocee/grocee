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
	Session.set('verifyEmailToken', token);
});

Accounts.onResetPasswordLink((token, done) => {
	Session.set('resetPasswordToken', token)
});