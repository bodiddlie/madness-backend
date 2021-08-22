# Backend API Design for Pile of Shame

## Endpoints

| Name          | Method | URI                         | Description                                                       |
| ------------- | ------ | --------------------------- | ----------------------------------------------------------------- |
| signup        | POST   | `/{env}/signup`             | Allows user to request a magic link for login                     |
| login         | POST   | `/{env}/login`              | Validates a magic link token, generates a JWT and sends to client |
| search        | GET    | `/{env}/search?name={name}` | Searches for games with given name and returns a list             |
| add           | POST   | `/{env}/games`              | Adds a game to the pile of shame                                  |
| remove        | DELETE | `/{env}/games/{gameId}`     | Removes a game from the pile of shame                             |
| get games     | GET    | `/{env}/games`              | Retrieves all games on the pile of shame for a user               |
| complete game | PATCH  | `/{env}/games/{gamdId}`     | Marks a game as complete                                          |
| update sort   | PATCH  | `/{env}/games/`             | Takes a list of games and updates the sort order for each one     |

## Dynamo DB Table Design

### User Profile

| Attribute Name | Example           | Description                                                                        |
| -------------- | ----------------- | ---------------------------------------------------------------------------------- |
| PK             | `USER#{email}`    | Partition key based on `USER#` prefix and user email. Will be PK for all entities. |
| SK             | `PROFILE#{email}` | Sort key to identify a user profile                                                |
| createdAt      | `{timestamp}`     | Timestamp record was created                                                       |
| updateAt       | `{timestamp}`     | Timestamp record was last updated                                                  |

> Other attributes TBD

### User Session

| Attribute Name | Example               | Description                                                                        |
| -------------- | --------------------- | ---------------------------------------------------------------------------------- |
| PK             | `USER#{email}`        | Partition key based on `USER#` prefix and user email. Will be PK for all entities. |
| SK             | `SESSION#{sessionId}` | Sort key to identify a user session                                                |
| createdAt      | `{timestamp}`         | Timestamp record was created                                                       |
| updateAt       | `{timestamp}`         | Timestamp record was last updated                                                  |

> Other attributes TBD

### Game

| Attribute Name | Example        | Description                                                                        |
| -------------- | -------------- | ---------------------------------------------------------------------------------- |
| PK             | `USER#{email}` | Partition key based on `USER#` prefix and user email. Will be PK for all entities. |
| SK             | `GAME#{title}` | Sort key to identify a game by name                                                |
| createdAt      | `{timestamp}`  | Timestamp record was created                                                       |
| updateAt       | `{timestamp}`  | Timestamp record was last updated                                                  |
| title          | `Bloodborne`   | title of game on the pile of shame                                                 |
| completed      | `false`        | boolean value to indicate if game is completed or not                              |
| sortOrder      | `1`            | integer representing sort order of game in the list                                |
| boxArt         | `{imageUrl}`   | URL to the box art for the game                                                    |

> Box art can be retrieved from GB api, but this might alleviate extra calls?
