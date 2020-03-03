package com.hediger.recipes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class SpringDataJpaUserDetailsService implements UserDetailsService {

	private final ChefRepository;

	@Autowired
	public SpringDataJpaUserDetailsService(ChefRepository, repository) {
		this.repository = repository;
	}

	@Override
	public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
		Chef chef = this.repository.findbyname(name);
		return new User(chef.getName(), chef.getPassword(), AuthorityUtils.createAuthorityList(chef.getRoles()));
	}
}
