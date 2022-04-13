# BE Northcoders NC News Portfolio Check List

## Readme - Remove the one that was provided and write your own

- [✓] Link to hosted version
- [✓] Write a summary of what the project is
- [✓] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [✓] Include information about how to create `.env.test` and `.env.development` files
- [✓] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [✓] Remove any unnecessary `console.logs` and comments
- [✓] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)
- [✓] .gitignore the `.env` files

## Connection to db

- [✓] Throw error if `process.env.PGDATABASE` is not set

## Creating tables

- [✓] Use `NOT NULL` on required fields
- [✓] Default `created_at` in articles and comments tables to the current date:`TIMESTAMP DEFAULT NOW()`
- [✓] Delete all comments when the article they are related to is deleted: Add `ON DELETE CASCADE` to `article_id` column in `comments` table.

## Inserting data

- [✓] Make sure util functions do not mutate data
- [✓] Make util functions easy to follow with well named functions and variables
- [✓] Test util functions
- [✓] Drop tables and create tables in seed function

## Tests

- [✓] Seeding before each test
- [✓] If asserting inside a `forEach`, also has an assertion to check length is at least > 0
**add one before line 134**
- [✓] Ensure all tests are passing
- [ ] Cover all endpoints and errors

- `GET /api/topics`

  - [✓] Status 200, array of topic objects

- `GET /api/articles/:article_id`

  - [✓] Status 200, single article object (including `comment_count`)
  - [✓] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✓] Status 404, non existent ID, e.g. 0 or 9999
  **include tests for the above**

- `PATCH /api/articles/:article_id`

  - [✓] Status 200, updated single article object
  - [✓] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✓] Status 404, non existent ID, e.g. 0 or 9999
  - [✓] Status 400, missing / incorrect body, e.g. `inc_votes` property is not a number, or missing

- `GET /api/articles`

  - [✓] Status 200, array of article objects (including `comment_count`, excluding `body`)
  - [✓] Status 200, default sort & order: `created_at`, `desc`
  - [✓] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
  - [✓] Status 200, accepts `order` query, e.g. `?order=desc`
  - [✓] Status 200, accepts `topic` query, e.g. `?topic=coding`
  - [✓] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
  - [✓] Status 400. invalid `order` query, e.g. `?order=bananas`
  - [✓] Status 404. non-existent `topic` query, e.g. `?topic=bananas`
  - [✓] Status 200. valid `topic` query, but has no articles responds with an empty array of articles, e.g. `?topic=paper`

**First test description is very long - would recommend either splitting into 2 tests for behaviours or removing list of properties**
**Default tests with no queries required**
**Use jest sorted for toBeSortedBy to check sort_by**
**test on line 102 is for 'desc' but query is 'ASC'**

- `GET /api/articles/:article_id/comments`

  - [✓] Status 200, array of comment objects for the specified article
  - [✓] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✓] Status 404, non existent ID, e.g. 0 or 9999
  - [✓] Status 200, valid ID, but has no comments responds with an empty array of comments

- `POST /api/articles/:article_id/comments`

  - [✓] Status 201, created comment object
  - [✓] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✓] Status 404, non existent ID, e.g. 0 or 9999
  - [✓] Status 400, missing required field(s), e.g. no username or body properties
  - [✓] Status 404, username does not exist
  - [ ] Status 201, ignores unnecessary properties
  **This should still succeed ignoring the unnecessary properties instead of 403**

- `GET /api`

  - [✓] Status 200, JSON describing all the available endpoints

## Routing

- [ ] Split into api, topics, users, comments and articles routers
- [ ] Use `.route` for endpoints that share the same path

## Controllers

- [✓] Name functions and variables well
- [✓] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)

## Models

- Protected from SQL injection
  - [✓] Using parameterized queries for values in `db.query` e.g `$1` and array of variables
  - [ ] Sanitizing any data for tables/columns, e.g. greenlisting when using template literals or pg-format's `%s`
- [✓] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [✓] Use `LEFT JOIN` for comment counts

**typo on line 22 of model 'ILIKE'**

## Errors

- [✓] Use error handling middleware functions in app and extracted to separate directory/file
- [✓] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Tasks - To be completed after hosting

- `DELETE /api/comments/:comment_id`

- [✓] Status 204, deletes comment from database
- [✓] Status 404, non existant ID, e.g 999
- [✓] Status 400, invalid ID, e.g "not-an-id"

- `GET /api/users`

- [✓] Status 200, responds with array of user objects

- `GET /api/users/:username`

- [ ] Status 200, responds with single user object
- [ ] Status 404, non existant ID, e.g 999
- [ ] Status 400, invalid ID, e.g "not-an-id"

- `PATCH /api/comments/:comment_id`

  - [ ] Status 200, updated single comment object
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 400, missing / incorrect body, e.g. `inc_votes` property is not a number, or missing

## Extra Advanced Tasks

### Easier

- [ ] Patch: Edit an article body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an article by title
- [ ] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get articles created in last 10 minutes
- [ ] Get: Get all articles that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for topics
