import React from 'react'
import ReactDOM from 'react-dom'

import UpdateDialog from './UpdateDialog'

class Recipe extends React.Component {

	constructor(props) {
		super(props)
		this.handleDelete = this.handleDelete.bind(this)
	}

	handleDelete() {
		this.props.onDelete(this.props.recipe)
	}

	render() {
		return (
			<tr>
				<td>{this.props.recipe.entity.recipeTitle}</td>
				<td>{this.props.recipe.entity.description}</td>
				<td>{this.props.recipe.entity.ingredient}</td>
				<td>{this.props.recipe.entity.chef.name}</td>
				<td>
					<UpdateDialog recipe={this.props.recipe}
							attributes={this.props.attributes}
							onUpdate={this.props.onUpdate}
							loggedInChef={this.props.loggedInChef} />
				</td>
				<td>
					<button onClick={this.handleDelete}>delete</button>
				</td>
			</tr>
		)
	}
}

export default Recipe
