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
	
		// TODO: defaulting to 1 item for now, will need to change once we can get the input 
		Meteor.call('groceries.insert', text, '1');
	
		// Clear form
		ReactDOM.findDOMNode(this.refs.textInput).value = '';
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

					<form className="new-grocery" onSubmit={this.handleSubmit.bind(this)} >
						<input type="text" ref="textInput" placeholder="Type to add new groceries" />
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