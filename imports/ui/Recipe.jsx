import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Recipes } from '../api/recipes';

export default class Recipe extends Component {
	
	deleteThisRecipe() {
		Meteor.call('recipes.remove', this.props.recipe._id);
	}
	
	render() {
	
		return (
			<li>
				<button className="delete" onClick={this.deleteThisRecipe.bind(this)}>
					&times;
				</button>
	
				<a href={this.props.recipe.url}><span className="text">{this.props.recipe.name}</span></a>
			</li>
		);
	}
}

Recipe.propTypes = {
	Recipes: PropTypes.shape({
		name: PropTypes.string,
		url: PropTypes.string,
		_id: PropTypes.string
	})
}