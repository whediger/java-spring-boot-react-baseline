package com.hediger.recipes;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

@PreAuthorize("hasRole('ROLE_CHEF')")
public interface RecipeRepository extends PagingAndSortingRepository<Recipe, Long> {

	@Override
	@PreAuthorize("#recipe?.chef == null or #recipe?.chef?.name == authentication?.name")
	Recipe save(@Param("recipe") Recipe recipe);

	@Override
	@PreAuthorize("@recipeRepository.findById(#id)?.chef?.name == authentication?.name")
	void deleteById(@Param("id") Long id);

	@Override
	@PreAuthorize("#recipe?.chef?.name == authentication?.name")
	void delete(@Param("recipe") Recipe recipe);

}
