import React from 'react'
import { render } from 'react-dom'
import App from './components/App'

window.React = React

render (
	<App loggedInChef={document.getElementById('chefname').innerHTML}/>,
	document.getElementById('react-container')
)
