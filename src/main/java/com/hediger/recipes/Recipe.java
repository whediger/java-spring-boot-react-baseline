package com.hediger.recipes;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Recipe {

	private @Id @GeneratedValue Long id;
	private String recipeTitle;
	private String description;
	private String ingredient;

	public Recipe() {}

	public Recipe(String recipeTitle, String description, String ingredient) {
		this.recipeTitle = recipeTitle;
		this.description = description;
		this.ingredient = ingredient;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Recipe recipe = (Recipe) o;
		return Objects.equals(id, recipe.id) &&
			Objects.equals(recipeTitle, recipe.recipeTitle) &&
			Objects.equals(description, recipe.description) &&
			Objects.equals(ingredient, recipe.ingredient);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, recipeTitle, description, ingredient);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getrecipeTitle() {
		return recipeTitle;
	}

	public void setrecipeTitle(String recipeTitle) {
		this.recipeTitle = recipeTitle;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getIngredient() {
		return ingredient;
	}

	public void setingredient(String ingredient) {
		this.ingredient = ingredient;
	}

	@Override
	public String toString() {
		return "Recipe{" +
		"id: " + id +
		", recipeTitle: " + recipeTitle +
		", description: " + description +
		", ingredient: " + ingredient +
		"}";
	}

}
