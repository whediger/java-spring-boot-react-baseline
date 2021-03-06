package com.hediger.recipes.models.recipe;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.hediger.recipes.models.chef.*;

@Entity
public class Recipe {

	private @Id @GeneratedValue Long id;
	private String recipeTitle;
	private String description;
	private String ingredient;

	private @Version @JsonIgnore Long version;

	private @ManyToOne Chef chef;

	public Recipe() {}

	public Recipe(String recipeTitle, String description, String ingredient, Chef chef) {
		this.recipeTitle = recipeTitle;
		this.description = description;
		this.ingredient = ingredient;
		this.chef = chef;
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
			Objects.equals(version, recipe.version) &&
			Objects.equals(chef, recipe.chef);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, recipeTitle, description, ingredient, version, chef);
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

	public Chef getChef() {
		return chef;
	}

	public void setChef(Chef chef) {
		this.chef = chef;
	}

	@Override
	public String toString() {
		return "Recipe{" +
		"id: " + id +
		", recipeTitle= " + recipeTitle +
		", description= " + description +
		", ingredient= " + ingredient +
		", version= " + version  +
		", chef= " + chef  +
		"}";
	}

}
