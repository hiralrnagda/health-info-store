# INFO 7255 Adanced Big Data Applications/Indexing
---
##### Step 1: Install redis on windows using the following steps:  
1. Install WSL(Windows Subsystem for Linux)  
2. Launch WSL  
3. Run "sudo apt-get install redis"  
4. Run "sudo service redis-server start". This should start Redis server in the background running on default port - 6379
5. Run `redis-cli` to interact with the redis cli
---
##### Step 2: Install Elastic search, Kibana and RabbitMQ on windows using the following steps:
-- To install ELK stack version 8.7.x on windows I followed this youtube link -
https://www.youtube.com/watch?v=BybAetckH88&t=638s
:green_heart: To connect elastic search and kibana with your application you will have to copy-paste the elasticsearch.yaml and kibana.yaml from respective config folders to this config folder.

-- To install RabbitMQ on windows i followed this youtube link :
https://www.youtube.com/watch?v=V9DWKbalbWQ
RabbitMQ explanation and code implementation - https://dev.to/pharzad/introduction-to-rabbitmq-for-node-js-developers-1clm

Default ports:
Elasticsearch - http://localhost:9200
Kibana - http://localhost:5601
RabbitMQ - http://localhost:15762
---
##### Step 3: Install and run the NodeJS app:
1. Download/Clone the repository  
2. navigate to the folder in cmd prompt/terminal  
3. make sure to have node and npm installed  
4. run "npm install" to install all dependencies mentioned in the package.json "dependencies" section and to setup node_modules folder  
5. run "npm start" to run the application on port 3535  
---
## Endpoints
There are 7 endpoints specified:  
1. GET: http://localhost:3001/auth/getToken
-- returns a RS256 bearer token that expires in 1hr
----
2. POST: http://localhost:3001/auth/validateToken
-- informs validity of bearer token  
----
3. POST: http://localhost:3001/plans/:planId 
-- this accepts a medical insurance plan whose schema is specified in the src/routes/planRoutes.js file
-- if an object with the same ObjectID exists within the redis server, or if there is incorrect schema, no object is created in the DB  
----
4. GET: http://localhost:3001/plans/:planId
-- this returns medical plan object of ObjectID specified in the request URL after plans/ if exists in the DB  
----
5. DELETE: http://localhost:3001/plans/:planId
-- this deletes a medical plan object of ObjectID specified in the request URL after plans/ if exists in the DB  
----
6. PATCH: http://localhost:3001/plans/:planId 
-- this updates medical plan object of ObjectID specified in the request URL after plans/ if plan exists in db
-- header has If-Match attribute  
-- header If-Match ETag matches ETag of object plan
-- in request body is different from plan in db 
----
7. PUT: http://localhost:3001/plans/:planId 
-- this updates medical plan object of ObjectID specified in the request URL after plans/ if plan exists in db or creates one in doesn't exist in db
-- header has If-Match attribute  
-- header If-Match ETag matches ETag of object plan
-- in request body is different from plan in db
----
Final Demo screen shots:
--- Invalid Token
![invalidToken](https://user-images.githubusercontent.com/48949772/232255734-238eb400-125f-4683-bf1a-57070ddb1d31.jpg)
----
--- Redis CLI
![redis-cli](https://user-images.githubusercontent.com/48949772/232255686-12c0c183-8284-4a79-bf4d-6066d727c1f0.jpg)
----
--- Kibana - while running elastic search queries 
![elasticQueriesOnKibana](https://user-images.githubusercontent.com/48949772/232255697-8061e8ab-5592-4d40-8c75-1cfe6ee653fd.jpg)
----
![elasticQueriesOnKibanaAfterPUT](https://user-images.githubusercontent.com/48949772/232255708-aed2346a-f171-420b-90c1-e8e8b1e23483.jpg)
---
--- RabbitMQ dashboard
![rabbitMQ1](https://user-images.githubusercontent.com/48949772/232255759-a9f8e173-33f9-4ba6-b689-c1981bc47926.jpg)
-----
![rabbitMQ2](https://user-images.githubusercontent.com/48949772/232255749-29025d68-f098-4df9-ab6e-fef055d78437.jpg)
-----
![rabbitMQ3](https://user-images.githubusercontent.com/48949772/232255745-ab1ff259-2633-4d25-91c8-c1d215fb41b7.jpg)
