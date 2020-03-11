import C from "../constants"

export const recipe = (state={}, action) => {
	switch (action.type) {
		case C.ADD_RECIPE :
			return state = (state) =>
			({
				recipeTitle: action.recipeTitle,
				description: action.description,
				ingredient: action.ingredient,
				chef: action.chef
			})
		default :
			return state
	}
}

export const loggedInChef = (state={}, action) => {
	switch (action.type) {
		case C.SET_CHEF_NAME :
			return state = (state) =>
			({
				name: action.name
			})
		default :
			return state
	}
}
