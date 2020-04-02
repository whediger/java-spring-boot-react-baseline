import { createStore, combineReducers, applyMiddleware } from 'redux'
import { recipes, loggedInChef } from './reducers'
import client from '../lib/client'
import when from 'when'

const root = '/api'
const follow = require('../lib/follow')
//import stateData from '../../NOT USING FILE FOR THIS'

var initialRecipes = []

function loadFromServer(pageSize=2) {
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
		initialRecipes = recipes
		console.log("index.js: initialRecipes (last callback)");
		console.log(initialRecipes);

		initialState()
		return recipes
		// setState({
		// 	recipes: recipes,
		// 	attributes: Object.keys(this.schema.properties),
		// 	pageSize: pageSize,
		// 	links: this.links
		// })
	})
}

function initialState() {
	console.log("index.js: chefname ");
	console.log(document.getElementById('chefname').innerHTML);
	var dataStore = {loggedInChef: {
		name: document.getElementById('chefname').innerHTML
		},
		recipes: initialRecipes
	}
	console.log("index.js: initialState: dataStore:");
	console.log(dataStore);
	return dataStore
}

let console = window.console

const logger = store => next => action => {
	let result
	console.groupCollapsed("dispatching", action.type)
	console.log('action', action)
	result = next(action)
	console.log('next state', store.getState())
	console.groupEnd()
	return result
}

const saver = store => next => action => {
	let result = next(action)
	//TODO: put code to send save to db here
	//add code to save state here
}

// const storeFactory = (initialState=**stateDataNOTUSINGTHIS**) =>
//NEED TO MKE CALL TO GET INTIAL STATE
const storeFactory = () =>
	applyMiddleware(logger, saver)(createStore)(
		combineReducers({recipes, loggedInChef}),
			loadFromServer()
	)

export default storeFactory
