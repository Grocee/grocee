import { Meteor } from 'meteor/meteor';
import { Component } from 'react';
import PropTypes from 'prop-types';

import { Inventories } from '../api/inventories';

export default class Inventory extends Component {
	
	deleteThisInventory() {
		Meteor.call('inventories.remove', this.props.inventory._id);
	}
	
	render() {
		
		return (
			<li>
				<button className="delete" onClick={this.deleteThisInventory.bind(this)}>
					&times;
				</button>

				<span className="text">{this.props.inventory.name} - {this.props.inventory.amount}</span>
			</li>
		);
	}
}

Inventory.propTypes = {
	Inventories: PropTypes.shape({
		name: PropTypes.string,
		amount: PropTypes.string,
		_id: PropTypes.string
	})
}