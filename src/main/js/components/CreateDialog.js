import React from 'react'
import ReactDOM from 'react-dom'

import { addRecipe } from '../actions'

var chefStore = {}

class CreateDialog extends React.Component {

	constructor(props) {
		super(props)
		chefStore = store.getState()
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit(e) {
		e.preventDefault()
		const newRecipe = {};
		this.props.attributes.forEach(attribute => {
			newRecipe[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
		})
		this.props.onCreate(newRecipe)

		//TODO: +==}========>

		onNewRecipe(
			ReactDOM.findDOMNode(this.refs["recipeTitle"]).value.trim(),
			ReactDOM.findDOMNode(this.refs["description"]).value.trim(),
			ReactDOM.findDOMNode(this.refs["ingredient"]).value.trim(),
			chefStore.loggedInChef.name
		)

		//TODO: remove scaffolding
		console.log("CreateDialog: App action +==}========>");
		console.log(action);

		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = ''
		})

		window.location = '#'
	}

	render() {
		const inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input type="text" placeholder={attribute} ref={attribute} className="field" />
			</p>
		)

		return (
			<div>
				<a href="#createRecipe">Create</a>
				<div id="createRecipe" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>
						<h2>Create new Recipe</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default CreateDialog
