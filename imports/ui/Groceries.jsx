import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Groceries } from '../api/groceries';
 
// Task component - represents a single todo item
export default class GroceryItem extends Component {

	toggleChecked() {
		// Set the checked property to the opposite of its current value
		Groceries.update(this.props.groceries._id, {
			$set: { checked: !this.props.groceries.checked },
		});
	}
	 
	deleteThisGrocery() {
		Groceries.remove(this.props.groceries._id);
	}
	
	render() {
		// Give tasks a different className when they are checked off,
		// so that we can style them nicely in CSS
		const groceriesTaskName = this.props.groceries.checked ? 'checked' : '';
		
		return (
			// <li>{this.props.task.props.task.text}</li>
			<li className={groceriesTaskName}>
				<button className="delete" onClick={this.deleteThisGrocery.bind(this)}>
					&times;
				</button>
		
				<input
					type="checkbox"
					readOnly
					checked={!!this.props.groceries.checked}
					onClick={this.toggleChecked.bind(this)}
				/>
		
				<span className="text">{this.props.groceries.text}</span>
			</li>
		);
	}
}

GroceryItem.PropTypes = {
	groceries: PropTypes.shape({
		checked: PropTypes.bool,
		text: PropTypes.string,
		_id: PropTypes.string
	})
}