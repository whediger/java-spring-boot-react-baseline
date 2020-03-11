import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {createStore, combineReducers } from 'redux'
import { recipe, loggedInChef } from './store/reducers'
import App from './components/App'

const combined = combineReducers({ recipe, loggedInChef })

const store = createStore(combined, { loggedInChef: { name: document.getElementById('chefname').innerHTML }})

window.React = React
window.store = store

render (
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('react-container')
)
