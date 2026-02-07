#!/bin/bash

# Exit immediately if any command fails
set -e

set -a        # automatically export all variables
source .env.development   # load variables from .env into the current shell
set +a

dropdb-17 --if-exists "$PGDATABASE"
createdb-17 "$PGDATABASE"
sudo -u "$PG_SUDO_USER" psql-17 "$PGDATABASE" -f ./src/db/postgres/schema.sql
sudo -u "$PG_SUDO_USER" psql-17 -d postgres -c "ALTER DATABASE ${PGDATABASE} OWNER TO ${PGUSER}"
sudo -u "$PG_SUDO_USER" psql-17 -d "$PGDATABASE" -c "ALTER TABLE bins OWNER TO ${PGUSER}"
sudo -u "$PG_SUDO_USER" psql-17 -d "$PGDATABASE" -c "ALTER TABLE records OWNER TO ${PGUSER}"

# reset-githubpayloads

DB_NAME="request_bin_development"
COLLECTION_NAME="githubpayloads"
MONGO_USER=prestonmacy
MONGO_PASSWORD=password



mongosh "$DB_NAME" --eval "db.dropDatabase()"
mongosh "$DB_NAME" --eval "db.createCollection('${COLLECTION_NAME}')"
mongosh "$DB_NAME" --eval "
  db.createUser({
    user: '$MONGO_USER',
    pwd: '$MONGO_PASSWORD',
    roles: [{ role: 'readWrite', db: '$DB_NAME'}]
  });
"
