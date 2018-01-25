import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { withTracker } from 'meteor/react-meteor-data';

import { Groceries } from '../api/groceries';
import GroceryItem from './GroceryItem';
 
// App component - represents the whole app
class App extends Component {

	handleSubmit(event) {
		event.preventDefault();
	
		// Find the text field via the React ref
		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
		const quantity = ReactDOM.findDOMNode(this.refs.quantityInput).value.trim();

		// rudimentary input validation
		if (!text || !quantity) {
			alert("Invalid input")
			return
		}
	
		Meteor.call('groceries.insert', text, quantity);
	
		// Clear form
		ReactDOM.findDOMNode(this.refs.textInput).value = '';
		ReactDOM.findDOMNode(this.refs.quantityInput).value = '';
	}
 
	renderGroceries() {
		return this.props.groceries.map(grocery => (
			<GroceryItem key={grocery._id} grocery={grocery} />
		));
	}

	render() {
		return (
			<div className="container">
				<header>
					<h1>Grocery List</h1>

					<form className="new-grocery" onSubmit={this.handleSubmit.bind(this)}>
						<input type="text" ref="textInput" placeholder="Type to add new groceries" />
						<input type="text" ref="quantityInput" placeholder="Enter the quantity" />
						<input type="submit" />
					</form>
				</header>

				<ul>
					{this.renderGroceries()}
				</ul>
			</div>
		);
	}
}

export default withTracker(() => {
	return {
		groceries: Groceries.find({}, { sort: { createdAt: -1 } }).fetch()
	};
})(App);