import React from 'react'
import ReactDOM from 'react-dom'
import client from './client'

const follow = require('./follow')

const root = '/api'

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {recipes: [], attributes: [], pageSize: 2, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this)
		this.onCreate = this.onCreate.bind(this)
		this.onUpdate = this.onUpdate.bind(this)
		this.onDelete = this.onDelete.bind(this)
		this.onNavigate = this.onNavigate.bind(this)
	}

	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'recipes', params: {size: pageSize}}]
		).then(recipeCollection => {
			return client({
				method: 'GET',
				path: recipeCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity
				return recipeCollection
			})
		}).then(recipeCollection => {
			return recipeCollection.entity._embedded.recipes.map(recipe =>
							client({
								method: 'GET',
								path: recipe._links.self.href
							}))
		}).then(recipePromises => {
			return when.all(recipePromises);
		}).done(recipes => {
			this.setState({
				recipes: recipes,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: this.links
			})
		})
	}

	onCreate(newRecipe) {
		follow(client, root, ['recipes']).then(recipeCollection => {
			return client({
				method: 'POST',
				path: recipeCollection.entity._links.self.href,
				entity: newRecipe,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'recipes', params: {'size': this.state.pageSize}}])
		}).done(response => {
			if(typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href)
			} else {
				this.onNavigate(response.entity._links.self.href)
			}
		})
	}

	onUpdate(recipe, updatedRecipe) {
		client({
			method: 'PUT',
			path: employee.entity._links.self.href,
			entity: updatedRecipe,
			headers: {
				'Content-Type': 'application-json',
				'If-Match': recipe.headers.Etag
			}
		}).done(response => {
			if(response.status.code === 412) {
				alert('DENIED: unable to update ' +
						recipe.entity._links.self.href + ". your copy is stale")
			}
		})
	}

	onDelete(recipe) {
		client({method: 'DELETE', path: recipe._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize)
		})
	}

	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(recipeCollection => {
			this.setState({
				recipes: recipeCollection.entity._embedded.recipes,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: recipeCollection.entity._links
			})
		})
	}

	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize)
		}
	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize)
	}

	render() {
		return (
			<div>
				<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate} />
				<RecipeList recipes={this.state.recipes}
							links={this.state.links}
							pageSize={this.state.pageSize}
							onNavigate={this.onNavigate}
							onDelete={this.onDelete}
							updatePageSize={this.updatePageSize} />
			</div>
		)
	}
}

class CreateDialog extends React.Component {

	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit(e) {
		e.preventDefault()
		const newRecipe = {};
		this.props.attributes.forEach(attribute => {
			newRecipe[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
		})
		this.props.onCreate(newRecipe)

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
						<a href="#" title="close" className="close">X</a>
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

class UpdateDialog extends React.Component {

	constructor(props) {
		super(props)
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

class RecipeList extends React.Component {

	constructor(props) {
		super(props)
		this.handleNavFirst = this.handleNavFirst.bind(this)
		this.handleNavPrev = this.handleNavPrev.bind(this)
		this.handleNavNext = this.handleNavNext.bind(this)
		this.handleNavLast = this.handleNavLast.bind(this)
		this.handleInput = this.handleInput.bind(this)
	}

	handleInput(e) {
		e.preventDefault()
		const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value
		if(/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize)
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value =
				pageSize.substring(0, pageSize.length - 1)
		}
	}

	handleNavFirst(e) {
		e.preventDefault()
		this.props.onNavigate(this.props.links.first.href)
	}

	handleNavPrev(e) {
		e.preventDefault()
		this.props.onNavigate(this.props.links.prev.href)
	}

	handleNavNext(e) {
		e.preventDefault()
		this.props.onNavigate(this.props.links.next.href)
	}

	handleNavLast(e) {
		e.preventDefault()
		this.props.onNavigate(this.props.links.last.href)
	}

	render() {
		const recipes = this.props.recipes.map(recipe =>
			<Recipe key={recipe._links.self.href} recipe={recipe} onDelete={this.props.onDelete} />
		)

		const navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>)
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>)
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>)
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>)
		}

		return (
			<div>
				<input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput} />
				<table>
					<tbody>
						<tr>
							<th>recipe name</th>
							<th>description</th>
							<th>ingredient</th>
						</tr>
						{recipes}
					</tbody>
				</table>
				<div>
					{navLinks}
				</div>
			</div>
		)
	}
}

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
				<td>{this.props.recipe.recipeTitle}</td>
				<td>{this.props.recipe.description}</td>
				<td>{this.props.recipe.ingredient}</td>
				<td>
					<UpdateDialog recipe={this.props.recipe}
							attributes={this.props.attributes}
							onUpdate={this.props.onUpdate} />
				</td>
				<td>
					<button onClick={this.handleDelete}>delete</button>
				</td>
			</tr>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react-container')
)
