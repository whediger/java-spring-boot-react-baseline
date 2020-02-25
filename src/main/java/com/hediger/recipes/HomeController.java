// https://spring.io/guides/tutorials/react-and-spring-data-rest/
package com.hediger.recipes;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class HomeController {

	@RequestMapping(value="/")
	public String index() {
		//TODO: remove scaffolding
		System.out.println("index route hit +===}========>");
		return "index";
	}
}
