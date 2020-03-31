import { connect } from 'react-redux'
import { addRecipe } from '../actions'
import CreateDialog from './CreateDialog'

export const NewDialog = connect(
	null,
	dispatch =>
		({
			onNewRecipe(recipeTitle, description, ingredient, chef) {
				dispatch(addRecipe(recipeTitle, description, ingredient, chef))
			}
		})
)(CreateDialog)
