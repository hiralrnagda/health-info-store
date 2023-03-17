# INFO 7255 Adanced Big Data Indexing Techniques

## Instructions on how to use:  

##### Install redis on windows using the following steps:  
1. Install WSL(Windows Subsystem for Linux)  
2. Launch WSL  
3. Run "sudo apt-get install redis"  
4. Run "sudo service redis-server start". This should start Redis server in the background running on default port 
  
##### Install and run the NodeJS app:

1. Download/Clone the repository  
2. navigate to the folder in cmd prompt/terminal  
3. make sure to have node and npm installed  
4. run "npm install" to install all dependencies mentioned in the package.json "dependencies" section and to setup node_modules folder  
5. run "npm start" to run the application on port 3535  
### Add dependencies to package.json
``` npm i jsonwebtoken basic-auth ```
## Endpoints
There are 6 endpoints specified at present:  
1. GET: http://localhost:3535/auth/getToken
-- returns a RS256 bearer token that expires in 1hr
----
2. POST: http://localhost:3535/auth/validateToken
-- informs validity of bearer token  
----
3. POST: http://localhost:3535/plans/:planId 
-- this accepts a medical insurance plan whose schema is specified in the src/routes/planRoutes.js file
-- if an object with the same ObjectID exists within the redis server, or if there is incorrect schema, no object is created in the DB  
----
4. GET: http://localhost:3535/plans/:planId
-- this returns medical plan object of ObjectID specified in the request URL after plans/ if exists in the DB  
----
5. DELETE: http://localhost:3535/plans/:planId
-- this deletes a medical plan object of ObjectID specified in the request URL after plans/ if exists in the DB  
----
6. PATCH: http://localhost:3535/plans/:planId 
-- this updates medical plan object of ObjectID specified in the request URL after plans/ if plan exists in db
-- header has If-Match attribute  
-- header If-Match ETag matches ETag of object plan
-- in request body is different from plan in db 

### End of Demo 2
---