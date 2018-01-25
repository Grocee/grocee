import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Groceries } from '../api/groceries';
 
// Task component - represents a single todo item
export default class GroceryItem extends Component {

	toggleChecked() {
		// Set the checked property to the opposite of its current value
		Meteor.call('groceries.setChecked', this.props.grocery._id, !this.props.grocery.checked);
	}
	
	deleteThisGrocery() {
		Meteor.call('groceries.remove', this.props.grocery._id);
	}
	
	render() {
		// Give tasks a different className when they are checked off,
		// so that we can style them nicely in CSS
		const groceryClassName = this.props.grocery.checked ? 'checked' : '';
		
		return (
			// <li>{this.props.task.props.task.text}</li>
			<li className={groceryClassName}>
				<button className="delete" onClick={this.deleteThisGrocery.bind(this)}>
					&times;
				</button>
		
				<input
					type="checkbox"
					readOnly
					checked={!!this.props.grocery.checked}
					onClick={this.toggleChecked.bind(this)}
				/>
		
				<span className="text">{this.props.grocery.name} - {this.props.grocery.amount}</span>
			</li>
		);
	}
}

GroceryItem.propTypes = {
	groceries: PropTypes.shape({
		checked: PropTypes.bool,
		name: PropTypes.string,
		amount: PropTypes.string,
		_id: PropTypes.string
	})
}