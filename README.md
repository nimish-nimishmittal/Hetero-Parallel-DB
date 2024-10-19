
# Hetero Parallel DB

Welcome to **Hetero Parallel DB** – a unique program that showcases the power of parallelism in heterogeneous databases! With this setup, we’re seamlessly combining the worlds of PostgreSQL, MySQL, and MongoDB, allowing you to interact with these databases in parallel, without worrying about the different query syntaxes. Here’s how it all works!

## The Setup: Docker-Powered Containers

To get started, we’ve got a `docker-compose.yml` file that spins up containers for:

- **PostgreSQL** (handling user data in `user_database`)
- **MySQL** (managing reviews in `reviewsdb`)
- **MongoDB** (storing product details in `productsDB`)
- **Mongo Express** (a web interface to easily manage MongoDB)

These containers allow us to achieve **I/O parallelism** across different databases. So, whenever an event gets triggered, parallel queries run on all three databases at once, retrieving and processing data in sync!

### Key Databases:
- **PostgreSQL**: Stores user information.
- **MongoDB**: Holds product data.
- **MySQL**: Manages user reviews, using info from PostgreSQL and MongoDB.

### How to Run the Program:

1. First, install the necessary dependencies in the root directory by running:
   ```bash
   npm install
   ```

2. Set up the environment by running:
   ```bash
   sudo docker-compose up -d
   ```
   This command launches all the containers, setting up your databases in parallel.

3. Then, fire up the server with:
   ```bash
   node src/app.js
   ```
   This starts the server, and now the magic begins!

### Access the Program:

- **Mongo Express**: 
   - Visit [0.0.0.0:8081](http://0.0.0.0:8081) to manage MongoDB through a browser-friendly interface.
   
- **Program’s Signup Page**: 
   - Open [localhost:3000/signup.html](http://localhost:3000/signup.html) to sign up for the program. The signup information will be stored in PostgreSQL (`user_database`).

### What Happens Next?

1. **Sign Up**: Your data is saved in PostgreSQL.
2. **Sign In**: Once signed in, you'll see a table listing all available products from MongoDB.
3. **Leave a Review**: For every product, there’s a "Give Review" button. Your review gets stored in MySQL (`reviewsdb`), with user and product information coming from PostgreSQL and MongoDB. Everything is running in sync, parallel across databases!

### Stopping the Service

When you're done, don’t forget to stop the Docker service with:
   ```bash
   sudo docker-compose down
   ```
   This will stop all connections and bring down the containers.

### Amazing Fact!

An amazing thing about **Hetero Parallel DB** is that even if you stop or delete the project, or accidentally delete the database, **the data remains intact**! When you spin up the containers again, the data gets restored automatically, thanks to Docker’s persistent volumes.

---

Enjoy working with **Hetero Parallel DB** and experience the future of database parallelism in action!
