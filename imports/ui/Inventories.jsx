import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { withTracker } from 'meteor/react-meteor-data';

import Inventory from './Inventory';
import { Inventories } from '../api/inventories';

class InventoriesComponent extends Component {
	
	constructor(props) {
		super(props);
	}

	hanleAddInventory(event) {
		event.preventDefault();
	
		// Find the text field via the React ref
		const name = ReactDOM.findDOMNode(this.refs.inventoryInput).value.trim();
		const amount = ReactDOM.findDOMNode(this.refs.inventoryAmountInput).value.trim();

		// rudimentary input validation
		if (!name || !amount) {
			alert("Invalid input")
			return
		}

		Meteor.call('inventories.insert', name, amount);
	
		// Clear form
		ReactDOM.findDOMNode(this.refs.inventoryInput).value = '';
		ReactDOM.findDOMNode(this.refs.inventoryAmountInput).value = '';
	}

	renderAddInventory() {
		return (
			<form className="new-inventory" onSubmit={this.hanleAddInventory.bind(this)}>
				<input type="text" ref="inventoryInput" placeholder="Item name" />
				<input type="text" ref="inventoryAmountInput" placeholder="Enter amount" />
				<input type="submit" />
			</form>
		);
	}

	renderInventories() {
		if ( this.props.inventories.length > 0 ) {
			return this.props.inventories.map(inventory => (
				<Inventory key={inventory._id} inventory={inventory} />
			));
		} else {
			return (
				<p>You need to add some inventories!</p>
			);
		}
	}

	render() {
		return (
			<div>
				<h1>Inventories</h1>
				{this.renderAddInventory()}
				{this.renderInventories()}
			</div>	
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('inventories');

	return {
		inventories: Inventories.find({}).fetch()
	};
})(InventoriesComponent);