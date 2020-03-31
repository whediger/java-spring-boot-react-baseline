package com.hediger.recipes.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;

import com.hediger.recipes.models.recipe.*;
import com.hediger.recipes.models.chef.*;

@Component
public class DatabaseLoader implements CommandLineRunner {

	private final RecipeRepository recipes;
	private final ChefRepository chefs;

	@Autowired
	public DatabaseLoader(RecipeRepository recipeRepository, ChefRepository chefRepository) {
		this.recipes = recipeRepository;
		this.chefs = chefRepository;
	}

	@Override
	public void run(String... strings) throws Exception {

		Chef greg = this.chefs.save(new Chef("greg", "pass123", "ROLE_CHEF"));
		Chef wes = this.chefs.save(new Chef("wes", "pass123", "ROLE_CHEF"));

		SecurityContextHolder.getContext().setAuthentication(
			new UsernamePasswordAuthenticationToken("greg", "doesn't matter",
				AuthorityUtils.createAuthorityList("ROLE_CHEF")));

		this.recipes.save(new Recipe("cheese", "cheesy cheese", "cheddar", greg));
		this.recipes.save(new Recipe("stuff", "greatest stuffing", "stuffing", greg));
		this.recipes.save(new Recipe("pizza", "colorado pizza", "cheese, bread, olive oil", greg));

		SecurityContextHolder.getContext().setAuthentication(
			new UsernamePasswordAuthenticationToken("wes", "doesn't matter",
				AuthorityUtils.createAuthorityList("ROLE_CHEF")));

		this.recipes.save(new Recipe("pizza", "chicago pizza", "extra cheese, bread, tomatos", wes));
		this.recipes.save(new Recipe("soup", "poboy soup", "water, dirt and rocks", wes));
		this.recipes.save(new Recipe("curry", "coconut curry", "cocnut, curry and yummyness", wes));

		SecurityContextHolder.clearContext();
	}
}
