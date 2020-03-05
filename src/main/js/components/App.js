import React from 'react'
import ReactDOM from 'react-dom'
import client from '../lib/client'
import when from 'when'

import '../../stylesheets/main.scss'

const follow = require('../lib/follow')

const stompClient = require('../websocket-listener')

const root = '/api'

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {recipes: [], attributes: [], page: 1, pageSize: 2, links: {},
			loggedInChef: this.props.loggedInChef};
		this.updatePageSize = this.updatePageSize.bind(this)
		this.onCreate = this.onCreate.bind(this)
		this.onUpdate = this.onUpdate.bind(this)
		this.onDelete = this.onDelete.bind(this)
		this.onNavigate = this.onNavigate.bind(this)
		this.refreshCurrentPage = this.refreshCurrentPage.bind(this)
		this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this)
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
				//filter unneeded JSON schema properties out
				Object.keys(schema.entity.properties).forEach(function (property) {
					if(schema.entity.properties[property].hasOwnProperty('format') &&
							schema.entity.properties[property].format === 'uri') {
						delete schema.entity.properties[property]
					} else if(schema.entity.properties[property].hasOwnProperty('$ref')) {
						delete schema.entity.properties[property]
					}
				})

				this.schema = schema.entity
				this.links = recipeCollection.entity._links
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
		follow(client, root, ['recipes']).done(response => {
			client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: newRecipe,
				headers: {'Content-Type': 'application/json'}
			})
		})
	}

	onUpdate(recipe, updatedRecipe) {
		if(recipe.entity.chef.name === this.state.loggedInChef) {
			updatedRecipe['chef'] = recipe.entity.chef
			client({
				method: 'PUT',
				path: recipe.entity._links.self.href,
				entity: updatedRecipe,
				headers: {
					'Content-Type': 'application/json',
					'If-Match': recipe.headers.Etag
				}
			}).done(response => {
			/*let the websocket handler update the state*/
			}, response => {
				if(response.status.code === 403) {
					alert('ACCESS DENIED: You are not authorized to update' +
						recipe.entity._links.self.href)
				}
				if(response.status.code === 412) {
					alert('DENIED: unable to update ' +
							recipe.entity._links.self.href + ". your copy is stale")
				}
			})
		} else {
			alert("☠ ACCESS DENIED : You are not authorized to update record ☠")
		}
	}

	onDelete(recipe) {
		client({method: 'DELETE', path: recipe.entity._links.self.href}
		).done(response => {/*let webocket handle updating the UI */},
		response => {
			if(response.status.code === 403) {
				alert("☠ ACCESS DENIED : You are not authorized to update record ☠" +
					recipe.entity._links.self.href
				)
			}
		})
	}

	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(recipeCollection => {
			this.links = recipeCollection.entity._links

			return recipeCollection.entity._embedded.recipes.map(recipe =>
				client({
					method: 'GET',
					path: recipe._links.self.href
				})
			)
		}).then(recipePromises => {
			return when.all(recipePromises)
		}).done(recipes => {
			this.setState({
				recipes: recipes,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			})
		})
	}

	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize)
		}
	}

	refreshAndGoToLastPage(message) {
		follow(client, root, [{
			rel: 'recipes',
			params: {size: this.state.pageSize}
		}]).done(response => {
			if (response.entity._links.last !== undefined) {
				this.onNavigate(response.entity._links.last.href)
			} else {
				this.onNavigate(response.entity._links.self.href)
			}
		})
	}

	refreshCurrentPage(message) {
		follow(client, root, [{
			rel: 'recipes',
			params: {
				size: this.state.pageSize,
				page: this.state.page.number
			}
		}]).then(recipeCollection => {
			this.links = recipeCollection.entity._links
			this.page = recipeCollection.entity.page

			return recipeCollection.entity._embedded.recipes.map(recipe => {
				return client({
					method: 'GET',
					path: recipe._links.self.href
				})
			})
		}).then(recipePromises => {
			return when.all(recipePromises)
		}).then(recipes => {
			this.setState({
				page: this.page,
				recipes: recipes,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			})
		})
	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize)
		stompClient.register([
			{route: '/topic/newRecipe', callback: this.refreshAndGoToLastPage},
			{route: '/topic/updateRecipe', callback: this.refreshCurrentPage},
			{route: '/topic/deleteRecipe', callback: this.refreshCurrentPage}
		])
	}

	render() {
		return (
			<div>
				<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate} />
				<RecipeList page={this.state.page}
							recipes={this.state.recipes}
							links={this.state.links}
							pageSize={this.state.pageSize}
							attributes={this.state.attributes}
							onNavigate={this.onNavigate}
							onUpdate={this.onUpdate}
							onDelete={this.onDelete}
							updatePageSize={this.updatePageSize} />
							loggedInChef={this.state.loggedInChef}
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

		const isChefCorrect = this.props.recipe.entity.chef.name == this.props.loggedInChef

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
			<Recipe key={recipe.entity._links.self.href}
					recipe={recipe}
					attributes={this.props.attributes}
					onUpdate={this.props.onUpdate}
					onDelete={this.props.onDelete}
					loggedInChef={this.props.loggedInChef} />
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

export default App
