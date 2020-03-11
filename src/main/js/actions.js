import C from './constants'

export const addRecipe = (title, description, ingredient, chef) =>
	({
		type: C.ADD_RECIPE,
		title,
		description,
		ingredient,
		chef
	})
