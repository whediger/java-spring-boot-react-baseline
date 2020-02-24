package com.hediger.recipes;

public class DatabaseLoader implements CommandLineRunner {

	private final RecipeRepository repository;

	@Autowired
	public DatabaseLoader(RecipeRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... strings) throws exception {
		this.repository.save(new Recipe("cheddar Cheese", "open package and eat it", "cheddar from store"))
	}
}
