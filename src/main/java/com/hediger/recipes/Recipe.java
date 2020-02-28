package com.hediger.recipes;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Recipe {

	private @Id @GeneratedValue Long id;
	private String recipeTitle;
	private String description;
	private String ingredient;

	private @Version @JsonIgnore Long version;

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
			Objects.equals(ingredient, recipe.ingredient) &&
			Objects.equals(version, recipe.version);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, recipeTitle, description, ingredient, version);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRecipeTitle() {
		return recipeTitle;
	}

	public void setRecipeTitle(String recipeTitle) {
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

	public void setIngredient(String ingredient) {
		this.ingredient = ingredient;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	@Override
	public String toString() {
		return "Recipe{" +
		"id: " + id +
		", recipeTitle: " + recipeTitle +
		", description: " + description +
		", ingredient: " + ingredient +
		", version: " + version  +
		"}";
	}

}
