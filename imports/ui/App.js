import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Index from "./Index";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Router>
				<div>
					<nav className="navbar">
						<span>PANTRI</span>
					</nav>

					<div className="container">
						<Route path="/" exact component={Index}/>
						<Route path="/reset-password" component={ResetPassword}/>
						<Route path="/verify-email" component={VerifyEmail}/>
					</div>
				</div>
			</Router>
		);
	}
}