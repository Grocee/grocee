import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { withTracker } from 'meteor/react-meteor-data';

import { Groceries } from '../api/groceries';
import { Inventories } from '../api/inventories';
import { Recipes } from '../api/recipes';

import Grocery from './Grocery';
import Inventory from './Inventory';
import Recipe from './Recipe';
 
// App component - represents the whole app
class App extends Component {

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

	handleAddRecipe(event) {
		event.preventDefault();
	
		// Find the text field via the React ref
		const name = ReactDOM.findDOMNode(this.refs.recipeNameInput).value.trim();
		const url = ReactDOM.findDOMNode(this.refs.urlInput).value.trim();

		// rudimentary input validation
		if (!name || !url) {
			alert("Invalid input")
			return
		}

		Meteor.call('recipes.insert', name, url);
	
		// Clear form
		ReactDOM.findDOMNode(this.refs.recipeNameInput).value = '';
		ReactDOM.findDOMNode(this.refs.urlInput).value = '';
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
 
	renderGroceries() {
		return this.props.groceries.map(grocery => (
			<Grocery key={grocery._id} grocery={grocery} />
		));
	}

	renderRecipes() {
		return this.props.recipes.map(recipe => (
			<Recipe key={recipe._id} recipe={recipe} />
		));
	}

	renderInventories() {
		return this.props.inventories.map(inventory => (
			<Inventory key={inventory._id} inventory={inventory} />
		));
	}

	render() {
		return (
			<div className="container">
				<header>
					<h1>Grocery List</h1>

					<form className="new-grocery" onSubmit={this.handleAddGrocery.bind(this)}>
						<input type="text" ref="textInput" placeholder="Type to add a new grocery item" />
						<input type="text" ref="amountInput" placeholder="Enter the amount" />
						<input type="submit" />
					</form>
				</header>

				<ul>
					{this.renderGroceries()}
				</ul>

				<header>
					<h1>Recipe List</h1>

					<form className="new-recipe" onSubmit={this.handleAddRecipe.bind(this)}>
						<input type="text" ref="recipeNameInput" placeholder="Recipe Name" />
						<input type="text" ref="urlInput" placeholder="Enter recipe URL" />
						<input type="submit" />
					</form>
				</header>

				<ul>
					{this.renderRecipes()}
				</ul>

				<header>
					<h1>Inventory List</h1>

					<form className="new-inventory" onSubmit={this.hanleAddInventory.bind(this)}>
						<input type="text" ref="inventoryInput" placeholder="Item name" />
						<input type="text" ref="inventoryAmountInput" placeholder="Enter amount" />
						<input type="submit" />
					</form>
				</header>

				<ul>
					{this.renderInventories()}
				</ul>
			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('groceries');
	Meteor.subscribe('inventories');
	Meteor.subscribe('recipes');

	return {
		groceries: Groceries.find({}, { sort: { createdAt: -1 } }).fetch(),
		inventories: Inventories.find({}).fetch(),
		recipes: Recipes.find({}).fetch(),
	};
})(App);