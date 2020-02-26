import React from 'react'
import ReactDOM from 'react-dom'
import client from './client'

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {recipes: []};
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/recipes'}).done(response => {
			this.setState({recipes: response.entity._embedded.recipes})
		})
	}

	render() {
		return <RecipeList recipes={this.state.recipes} />
	}
}

class RecipeList extends React.Component {

	render() {
		const recipes = this.props.recipes.map(recipe =>
			<Recipe key={recipe._links.self.href} recipe={recipe} />
		);

		return (
			<table>
				<thead>
					<tr>
						<th>title</th>
						<th>description</th>
						<th>ingredient</th>
					</tr>
				</thead>
				<tbody>
					{recipes}
				</tbody>
			</table>
		)
	}
}

class Recipe extends React.Component {

	render() {
		return (
			<tr>
				<td>{this.props.recipeTitle}</td>
				<td>{this.props.recipe.description}</td>
				<td>{this.props.recipe.ingredient}</td>
			</tr>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react-container')
)
