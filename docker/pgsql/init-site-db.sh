#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE site OWNER site'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'site')\gexec
    DO \$\$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'site') THEN
        CREATE USER site WITH PASSWORD 'secret';
      END IF;
    END
    \$\$;
    ALTER DATABASE site OWNER TO site;
    GRANT ALL PRIVILEGES ON DATABASE site TO site;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname site <<-EOSQL
    GRANT ALL ON SCHEMA public TO site;
    ALTER SCHEMA public OWNER TO site;
EOSQL
