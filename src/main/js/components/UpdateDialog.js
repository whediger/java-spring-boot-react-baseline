import React from 'react'
import ReactDOM from 'react-dom'

var chefStore = {}

class UpdateDialog extends React.Component {

	constructor(props) {
		super(props)
		chefStore = store.getState()
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit(e) {
		e.preventDefault()
		const updatedRecipe = {}
		this.props.attributes.forEach(attribute => {
			updatedRecipe[attribute] =
				ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
		})
		this.props.onUpdate(this.props.recipe, updatedRecipe)
		window.location = '#'
	}

	render() {
		const inputs = this.props.attributes.map(attribute =>
				<p key={this.props.recipe.entity[attribute]}>
					<input type="text"
							placeholder={attribute}
							defaultValue={this.props.recipe.entity[attribute]}
							ref={attribute}
							className="field" />
				</p>
		)

		const dialogId = "updateRecipe-" + this.props.recipe.entity._links.self.href


		const isChefCorrect = this.props.recipe.entity.chef.name == chefStore.loggedInChef.name

		return (
			<div key={this.props.recipe.entity._links.self.href}>
				<a href={"#" + dialogId}>Update</a>
				<div id={dialogId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>
						<h2>Update a Recipe</h2>
						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Update</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default UpdateDialog
