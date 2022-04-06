# NCNEWS-BACKEND

This is a JS news application created with Node.js, Express & PostgreSQL. It's hosted on Heroku.

# Table of contents
- [NCNEWS-BACKEND](#ncnews-backend)
- [Table of contents](#table-of-contents)
- [General-Information <a name="general-information"></a>](#general-information-)
- [Technologies <a name="technologies"></a>](#technologies-)
- [Setup <a name="setup"></a>](#setup-)
  - [Cloning & Dependencies <a name="cloning-dependencies"></a>](#cloning--dependencies-)
  - [Create dotenv files <a name="create-dotenv-files"></a>](#create-dotenv-files-)
  - [Seeding & Testing <a name="seeding-testing"></a>](#seeding--testing-)
- [Link To Hosted Application on Heroku <a name="link-to-hosted-app"></a>](#link-to-hosted-application-on-heroku-)

# General-Information <a name="general-information"></a>

The NCNEWS app is an Express server with RESTful API endpoints that retrieves information from a PSQL database. It uses Node.js and particularly node-postgres in order to GET, POST, PATCH and DELETE data from our database. The project follows the model/controller architecture, where the models are responsible for the queries to the database and the controllers do the error-handling of the information. The NCNEWS-BACKEND was created as the first project of the Northcoders Bootcamp and will be used in the future as the backend routine of my FrontEnd project. The developer used Test-Driver-Development for the entire project. All the software requirements were converted to test cases before the software was fully developed and the actual software development was tracked by repeatedly testing the software against all test cases. The testing was done using Jest and Supertest.

# Technologies <a name="technologies"></a>

```
- Node.js: 16.13.1
- PostgreSQL: 14.2
- npm: 8.1.2
```

# Setup <a name="setup"></a>

## Cloning & Dependencies <a name="cloning-dependencies"></a>

The first step is to clone this repository locally and install the mandatory dependencies using <strong>npm install</strong>

<br> -> Please have a look at the list below in order to see the version of each dependency that the developer used. <-

```
- dotenv: 16.0.0
- express: 4.17.3
- node-postgres: 0.6.2
- pg: 8.7.3
- husky: 7.0.0
- jest: 27.5.1
- jest-extended: 2.0.0
- jest-sorted: 1.0.14
- pg-format: 1.0.4
- supertest: 6.2.2
```

## Create dotenv files <a name="create-dotenv-files"></a>

The step number 2 is related to some files that they have to be created in order to run this project.

There are two databases in this project the real looking development data and a simpler for test data. You need to create two <strong>dotenv files</strong> with the correct database names for the environments. They must be <strong>.env.test</strong> and <strong>.env.development</strong> and you have to add into each <strong>PGDATABASE=<database_name_here></strong>. The link between the former files and the database has already been done in the <strong>./db/connection.js</strong>

## Seeding & Testing <a name="seeding-testing"></a>

The last step is about the seeding of the database. The package.json file has the following scripts available for the developer

- setup-dbs: psql -f ./db/setup.sql
- seed: node ./db/seeds/run-seed.js
- test: jest

The setup-dbs drops (ie deletes) and creates our database. The second script is responsible for seeding the new database. Finally, all the tests can run with the use of the third command on jest.

# Link To Hosted Application on Heroku <a name="link-to-hosted-app"></a>

<p align="center">
  ➡️   <a href="https://my-ncnews-backend.herokuapp.com/api">Hosted NCNEWS App</a>   ⬅️
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/96417438/154854696-8dc47627-30c1-4dfc-9bc6-c41ee4708310.png">
</p>
