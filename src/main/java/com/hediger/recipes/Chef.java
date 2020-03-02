package com.hediger.recipies;

import java.util.Arrays;
import java.util.Objects;

import javax.persistance.Entity;
import javax.persistance.GeneratdValue;
import javax.persistance.Id;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.passwordEncoder;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
public class Chef {
	public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

	private @Id @GeneratedValue Long id;

	private String name;

	private @JsonIgnore String password;

	private String[] roles;

	public void setPassword(String password) {
		this.password = PASSWORD_ENCODER.encode(password);
	}

	protected Chef() {}

	public Chef(String name, String password, String... roles){
		this.name = name;
		this.password = password;
		this.roles = roles;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if(o == null || getClass() != o.getClass()) return false;
		Chef chef = (Chef) o;
		return Objects.equals(id, chef.id) &&
				Objects.equals(name, chef.name) &&
				Objects.equals(password, chef.password) &&
				Objects.equals(roles, chef.roles);
	}

	@Override
	public int hashcode() {
		int result = Objects.hash(id, name, password);
		result = 31 * result + Arrays.hashcode(roles);
		return result;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName(){
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public String[] getRoles() {
		return roles;
	}

	public void setRoles(String[] roles) {
		this.roles = roles;
	}

	@Override
	public String toString(){
		return "Chef{" +
						"id=" + id +
						", name=" + name + '\'' +
						", roles=" + Arrays.toString(roles) +
						"}";
	}
}
