import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'

import GroceriesComponent from './Groceries';
import InventoriesComponent from './Inventories';
import RecipesComponent from './Recipes';

import Home from './Home';
 
// App component - represents the whole app
class App extends Component {

	render() {
		return (
			<Router>
				<div>
					<h1>Hello and welcome!</h1>
					<ul>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/groceries">Groceries</Link></li>
						<li><Link to="/recipes">Recipes</Link></li>
						<li><Link to="/inventories">Inventory</Link></li>
					</ul>

					<hr/>

					<Route exact path="/" component={Home}/>
					<Route path="/groceries" component={GroceriesComponent}/>
					<Route path="/recipes" component={RecipesComponent}/>
					<Route path="/inventories" component={InventoriesComponent}/>
				</div>
			</Router>
		);
	}
}

export default App;