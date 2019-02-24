import React, { Component } from 'react';
import { Session } from 'meteor/session';
import { Accounts } from "meteor/accounts-base";

export default class App extends Component {
	
	constructor(props) {
		super(props);

		this.handleResetPassword = this.handleResetPassword.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handleConfirmPassword = this.handleConfirmPassword.bind(this);

		let resetPasswordToken = Session.get('resetPasswordToken');
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

		this.state = { verifyEmailToken, resetPasswordToken };
	}
	
	handlePassword(event) {
		this.setState({ newPassword: event.target.value });
	}

	handleConfirmPassword(event) {
		this.setState({ confirmPassword: event.target.value });
	}

	renderResetPasswordForm() {
		return (
			<form onSubmit={this.handleResetPassword}>
				<div className="form-group">
          <label>New Password</label>
          <input type="password" onChange={this.handlePassword} className="form-control"/>
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" onChange={this.handleConfirmPassword} className="form-control"/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
			</form>
		);
	}

	handleResetPassword(e) {
		e.preventDefault();
		this.setState({ didSubmitChangePassword: true });
		if (this.state.newPassword == this.state.confirmPassword) {
			Accounts.resetPassword(this.state.resetPasswordToken, this.state.newPassword, error => {
				this.setState({ changePasswordSuccess: !error });
				if (error) {
					this.setState({ changePasswordErrorMsg: error.reason });
				}
			});
		} else {
			this.setState({ changePasswordErrorMsg: 'Passwords do not match!' });
			this.setState({ changePasswordSuccess: false });
		}
	}

	renderChangePasswordResult() {
		if (this.state.changePasswordSuccess) {
			return (<p>Password changed successfully!</p>);
		} else if (this.state.changePasswordErrorMsg) {
			return (<p>{this.state.changePasswordErrorMsg}</p>);
		} else {
			return (<p>Failed to change password. Please try again later.</p>)
		}
  }

	render() {
		return (
      <div>
        <nav className="navbar">
          <span>PANTRI</span>
        </nav>
        <div className="container">
          {this.state.emailVerified 
            ? <h3>Email Verified!</h3>
            : null
          }
          {this.state.emailVerifyFailed
            ? <div>
              <h3>Email Verification Failed</h3>
              <p>{this.state.reason}</p>
            </div>
            : null}
          {this.state.resetPasswordToken
            ? this.renderResetPasswordForm()
            : null}
          {this.state.didSubmitChangePassword
            ? this.renderChangePasswordResult()
            : null}
        </div>
      </div>
		);
	}
}