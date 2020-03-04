package com.hediger.recipes.models.chef;

import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface ChefRepository extends Repository<Chef, Long> {

	Chef save(Chef chef);

	Chef findByName(String Name);
}
