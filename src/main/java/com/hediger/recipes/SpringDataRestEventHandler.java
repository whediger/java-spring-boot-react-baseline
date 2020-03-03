package com.hediger.recipes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.handleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(Recipe.class)
public class SpringDataRestEventHandler {

	private final ChefRepository chefRepository;

	@Autowired
	public SpringDataRestEventHandler(ChefRepository chefRepository) {
		this.chefRepository = chefRepository;
	}

	@HandleBeforeCreate
	@HandleBeforeSave
	public void applyUserInformationUsingSecurityContext(Recipe recipe) {

		String name = SecurityContextHolder.getContext().getAuthentication().getName();
		Chef chef = this.chefRepository.findByName(name);
		if (chef == null) {
			Chef newChef = new Manager();
			newChef.setName(name);
			newChef.setRoles(new String[]{"ROLE_CHEF"})
			chef = this.chefRepository.save(newChef);
		}
		recipe.setChef(chef);
	}
}
