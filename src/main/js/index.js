import React from 'react'
// import { createStore, combineReducers } from 'redux'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import storeFactory from './store'
// import { recipe, loggedInChef } from './store/reducers'

//MOVED TO index.js in store
// const combined = combineReducers({ recipe, loggedInChef })

// const store = createStore(combined, { loggedInChef: { name: document.getElementById('chefname').innerHTML }})

function results() {
	console.log("store value from results: ");
	console.log(store);
}

const store = storeFactory()

console.log("index.js: Provider: store");
console.log(store);

window.React = React
window.store = store

render (
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('react-container')
)
