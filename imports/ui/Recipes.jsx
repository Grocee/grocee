import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { withTracker } from 'meteor/react-meteor-data';

import Recipe from './Recipe';
import { Recipes } from '../api/recipes';

class RecipesComponent extends Component {
	
	constructor(props) {
		super(props);
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

	renderAddRecipe() {
		return (
			<form className="new-recipe" onSubmit={this.handleAddRecipe.bind(this)}>
				<input type="text" ref="recipeNameInput" placeholder="Recipe Name" />
				<input type="text" ref="urlInput" placeholder="Enter recipe URL" />
				<input type="submit" />
			</form>
		);
	}

	renderRecipes() {
		if ( this.props.recipes.length > 0 ) {
			return this.props.recipes.map(recipe => (
				<Recipe key={recipe._id} recipe={recipe} />
			));
		} else {
			<p>You need to add some recipes!</p>
		}
	}

	render() {
		return (
			<div>
				<h1>Recipes</h1>
				{this.renderAddRecipe()}
				{this.renderRecipes()}
			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('recipes');

	return {
		recipes: Recipes.find({}).fetch()
	};
})(RecipesComponent);