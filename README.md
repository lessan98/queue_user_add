First run npm install
Also, mysql and rabbitmq should be installed on your system.


The way this works, run both server.js and queue.js files. When you post a pyaload with the user data to the /api/users endpoint, that payload is passed on to the rabbitmq channel "add-user" and there a db connection is performed and a query is ran. The blacklist is just a map that checks in O(1) if the domain is blacklisted or not

Now, this is just a proof of concept, there are a bunch of things needed to have this usable in a real life scenario.

1. Blacklist checking should be able to also handle subdomains, also, i d keep it in a db, not just a plain json file on disk.
2. Validation. Currently there's 0 validation, there should be some for data types, for email. Also, after passing blacklist check, we should validate if the user wasn't already added.
3. Performance. Currently, for every user we add, we reopen the connection to the DB, some tweaking would be necessary to ensure that the connection is kept open as long as the queue is not empty. Connecting is quite an expensive operation. Maybe even add a pool of connections if the queue size is increased dramatically.
4. Response types. Currently there's no usefull responses from the web server, status codes should be set in place for validation or different errors (not being able to connect to db/rabbitmq for example)
5. Use of an ORM for database processing (for simple queries, ORM's are a big plus keeping the code clean and easy to understand, also managing security issues)
6. Adding an env file containing the connection details (host, user, password, port etc.) instead of keeping it hardcoded in git.