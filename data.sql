CREATE TABLE users
(
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp
    without time zone NOT NULL,
    last_login_at timestamp
    with time zone
);

    CREATE TABLE messages
    (
        id SERIAL PRIMARY KEY,
        from_username text NOT NULL REFERENCES users,
        to_username text NOT NULL REFERENCES users,
        body text NOT NULL,
        sent_at timestamp
        with time zone NOT NULL,
    read_at timestamp
        with time zone
);


        -- INSERT INTO users
        --     (username,password,first_name,last_name,phone)
        -- VALUES('alexm', 'hello1', 'alex', 'mars', '3232375382')
--         // INSERT INTO messages (from_username,to_username,body,sent_at,read_at)VALUES ('alexm','test','hey test how ya doing',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
-- // INSERT INTO messages (from_username,to_username,body,sent_at,read_at)VALUES ('test','alexm','Im good alex thanks for asking',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);



-- Need to figure out how to do this query so i get back the user data on the to_username or maybe i can just assemble the response afterwards and send it back 
-- SELECT id,to_username,body,sent_at,read_at
-- FROM messages
-- JOIN users 
-- ON users.username = to_username
-- WHERE from_username = 'alexm'