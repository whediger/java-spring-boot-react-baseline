import React from 'react'
import ReactDOM from 'react-dom'
import client from '../lib/client'
import when from 'when'
import { addRecipe } from '../actions'

import '../../stylesheets/main.scss'

var chefStore = {}

const follow = require('../lib/follow')

const stompClient = require('../websocket-listener')

const root = '/api'

import RecipeList from './RecipeList'

class App extends React.Component {

	constructor(props) {
		super(props);
		chefStore = store.getState()
		this.state = {recipes: [], attributes: [], page: 1, pageSize: 2, links: {},
			loggedInChef: chefStore.loggedInChef.name };
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
		console.log("newRecipe contents: -----------");
		console.log(newRecipe);
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
							updatePageSize={this.updatePageSize}
							loggedInChef={this.state.loggedInChef} />
			</div>
		)
	}
}

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

		const action = addRecipe(
							ReactDOM.findDOMNode(this.refs["recipeTitle"]).value.trim(),
							ReactDOM.findDOMNode(this.refs["description"]).value.trim(),
							ReactDOM.findDOMNode(this.refs["ingredient"]).value.trim(),
							chefStore.loggedInChef.name
						)
		//TODO: remove scaffolding
		console.log("App action +==}========>");
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

export default App
