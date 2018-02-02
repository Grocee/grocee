import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { withTracker } from 'meteor/react-meteor-data';

import Grocery from './Grocery';
import { Groceries } from '../api/groceries';

class GroceriesComponent extends Component {
	
	constructor(props) {
		super(props);
	}

	handleAddGrocery(event) {
		event.preventDefault();
	
		// Find the text field via the React ref
		const name = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
		const amount = ReactDOM.findDOMNode(this.refs.amountInput).value.trim();

		// rudimentary input validation
		if (!name || !amount) {
			alert("Invalid input")
			return
		}

		Meteor.call('groceries.insert', name, amount);
	
		// Clear form
		ReactDOM.findDOMNode(this.refs.textInput).value = '';
		ReactDOM.findDOMNode(this.refs.amountInput).value = '';
	}

	renderAddNewGroceries() {
		return (
			<form className="new-grocery" onSubmit={this.handleAddGrocery.bind(this)}>
				<input type="text" ref="textInput" placeholder="Type to add a new grocery item" />
				<input type="text" ref="amountInput" placeholder="Enter the amount" />
				<input type="submit" />
			</form>
		);
	}

	renderGroceries() {
		if ( this.props.groceries.length > 0 ) {
			return this.props.groceries.map(grocery => (
				<Grocery key={grocery._id} grocery={grocery} />
			));
		} else {
			<p>You need to add some groceries!</p>
		}
	}

	render() {
		return (
			<div>
				<h1>Groceries</h1>
				{this.renderAddNewGroceries()}
				{this.renderGroceries()}
			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('groceries');

	return {
		groceries: Groceries.find({}, { sort: { createdAt: -1 } }).fetch()
	};
})(GroceriesComponent);