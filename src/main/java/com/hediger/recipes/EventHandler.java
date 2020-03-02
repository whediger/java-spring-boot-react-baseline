package com.hediger.recipes;

import static com.hediger.recipes.WebSocketConfiguration.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(Recipe.class)
public class EventHandler {

	private final SimpMessagingTemplate websocket;

	private final EntityLinks entityLinks;

	@Autowired
	public EventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	@HandleAfterCreate
	public void newRecipe(Recipe recipe) {
		this.websocket.convertAndSend(
			MESSAGE_PREFIX + "/newRecipe", getPath(recipe)
		);
	}

	@HandleAfterDelete
	public void deleteRecipe(Recipe recipe) {
		this.websocket.convertAndSend(
			MESSAGE_PREFIX + "/deleteRecipe", getPath(recipe)
		);
	}

	@HandleAfterSave
	public void updateRecipe(Recipe recipe) {
		this.websocket.convertAndSend(
			MESSAGE_PREFIX+ "/updateRecipe", getPath(recipe)
		);
	}

	private String getPath(Recipe recipe) {
		return this.entityLinks.linkForItemResource(recipe.getClass(),
			recipe.getId()).toUri().getPath();
	}
}
