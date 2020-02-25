// https://spring.io/guides/tutorials/react-and-spring-data-rest/

@Controller
public class HomeController {

	@RequestMapping(value="/")
	public String index() {
		//TODO: remove scaffolding
		System.out.println("index route hit +===}========>")
		return "index";
	}
}
