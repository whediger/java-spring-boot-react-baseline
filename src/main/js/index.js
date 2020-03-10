import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {createStore, combineReducers } from 'redux'
import { recipe, chef } from './store/reducers'
import App from './components/App'

const combined = combineReducers({ recipe, chef })

const store = createStore(combined, { chef: { name: document.getElementById('chefname').innerHTML }})

console.log("___-------CHEF VALUE _----get state---->>>>>>>");
console.log(store.getState());

window.React = React
window.store = store

render (
	<Provider store={store}>
		<App loggedInChef={document.getElementById('chefname').innerHTML}/>
	</Provider>,
	document.getElementById('react-container')
)
