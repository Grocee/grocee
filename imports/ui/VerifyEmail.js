import React, { Component } from 'react';

import { Session } from 'meteor/session';
import { Accounts } from "meteor/accounts-base";

export default class VerifyEmail extends Component {
  
  constructor(props) {
    super(props);

		let verifyEmailToken = Session.get('verifyEmailToken');

		if (verifyEmailToken) {
			Accounts.verifyEmail(verifyEmailToken, error => {
				if (!error) {
					this.setState({ emailVerified: true })
				} else {
					this.setState({ emailVerifyFailed: true, reason: error.reason })
				}
			});
		}

		this.state = { verifyEmailToken };
  }

  renderEmailVerified() {
    return (<h3>Email verified!</h3>);
  }

  renderEmailVerifyFailed() {
    return (
      <div>
        <h3>Email Verification Failed</h3>
        <p>{this.state.reason}</p>
      </div>
    )
  }

  render() {
    return this.state.emailVerified ? this.renderEmailVerified() : this.renderEmailVerifyFailed();
  }
}