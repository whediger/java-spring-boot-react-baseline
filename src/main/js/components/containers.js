import { connect } from 'react-redux'
import { addRecipe } from '../actions'
import UpdateDialog from './UpdateDialog'

export const NewRecipe = connect(
	null,
	dispatch =>
		({
			onNewRecipe(recipeTitle, description, ingredient, chef) {
				dispatch(addRecipe(recipeTitle, description, ingredient, chef))
			}
		})
)(UpdateDialog)
