package com.hediger.recipes.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.hediger.recipes.models.chef.*;

@Component
public class SpringDataJpaUserDetailsService implements UserDetailsService {

	private final ChefRepository repository;

	@Autowired
	public SpringDataJpaUserDetailsService(ChefRepository repository) {
		this.repository = repository;
	}

	@Override
	public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
		Chef chef = this.repository.findByName(name);
		return new User(chef.getName(), chef.getPassword(), AuthorityUtils.createAuthorityList(chef.getRoles()));
	}
}
