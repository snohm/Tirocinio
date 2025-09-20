## AgriPapers
This project provides a keyword-based search engine for agricultural science papers. Articles are ranked by relevance, ensuring that the most closely matching results appear first.

### How to install and run
1. Download [Docker Desktop](https://www.docker.com/products/docker-desktop) for your OS. [Docker Compose](https://docs.docker.com/compose) will be automatically installed.
2. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) or download this repo.
3. At the root of the project add and edit these two files:
    1. `db_setup.env`
        ```
        POSTGRES_USER=          # User name 
        POSTGRES_PASSWORD=      # User password
        POSTGRES_DB=            # A db name
        ```
    2. `db_conn.env`
        ```
        DB_HOST=db              
        DB_PORT=5432
        DB_USER=                # 
        DB_PASSWORD=            # Use the parameters defined in the other file
        DB_NAME=                #
        ```
4. Start docker, then open the terminal and run:
    ```
    docker-compose up
    ```
    Wait until the build is finished.
5. The app will be available at [localhost:3000](http://localhost:3000)