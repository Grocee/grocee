import React, { Component } from 'react';

import { Session } from 'meteor/session';
import { Accounts } from "meteor/accounts-base";

export default class ResetPassword extends Component {
    
	constructor(props) {
		super(props);

		let resetPasswordToken = Session.get('resetPasswordToken');

		this.state = {
			resetPasswordToken,
			didSubmitChangePassword: false
		};
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

	handlePassword(event) {
		this.setState({ newPassword: event.target.value });
	}

	handleConfirmPassword(event) {
		this.setState({ confirmPassword: event.target.value });
	}
	
	renderResetPassword() {
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

	render() {
		return this.didSubmitChangePassword ? this.renderResetPassword() : this.renderChangePasswordResult();
	}
}