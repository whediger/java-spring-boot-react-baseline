import React from 'react'
import ReactDOM from 'react-dom'

import Recipe from './Recipe'

var chefStore = {}

class RecipeList extends React.Component {

	constructor(props) {
		chefStore = store.getState()
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
					loggedInChef={chefStore.loggedInChef.name} />
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

export default RecipeList
