#!/bin/bash -e
echo "Welcome to the bootstrap script."
echo "You are here:"
pwd
echo ~
# Edit the following to change the name of the database user that will be created:
#get the un/pw/dbs from your settings.js file
#SYNC_PATH=$(grep $'config.vm.synced_folder' Vagrantfile | awk -F\" '{print $4; exit}')
#echo $SYNC_PATH

cd /path/to/shamanic/webapp
pwd

APP_DB_USER=$(grep $'\t\tusername : ' ../settings.js | awk -F\" '{print $2;}')
APP_DB_PASS=$(grep $'\t\tpassword : ' ../settings.js | awk -F\" '{print $2;}')

# Edit the following to change the name of the database that is created (defaults to the user name)
APP_DB_NAME=$(grep $'\t\tdatabase : ' ../settings.js | awk -F\" '{print $2;}')

# Edit the following to change the version of PostgreSQL that is installed
PG_VERSION=9.4

#useradd $APP_DB_USER
#chpasswd $APP_DB_USER:$APP_DB_PASS

# Update package list and upgrade all packages
apt-get update > /dev/null
apt-get -y upgrade > /dev/null

if [ -z "$APP_DB_USER"] then
  echo "There was a problem reading your settings file, please check that it's formatted correctly."
fi

###########################################################
# Changes below this line are probably not necessary
###########################################################
print_db_usage () {
  echo "Your PostgreSQL database has been setup and can be accessed on your local machine on the forwarded port (default: 15432)"
  echo "  Host: localhost"
  echo "  Port: 15432"
  echo "  Database: $APP_DB_NAME"
  echo "  Username: $APP_DB_USER"
  echo "  Password: $APP_DB_PASS"
  echo ""
  echo "Admin access to postgres user via VM:"
  echo "  vagrant ssh"
  echo "  sudo su - postgres"
  echo ""
  echo "psql access to app database user via VM:"
  echo "  vagrant ssh"
  echo "  sudo su - postgres"
  echo "  PGUSER=$APP_DB_USER PGPASSWORD=$APP_DB_PASS psql -h localhost $APP_DB_NAME"
  echo ""
  echo "Env variable for application development:"
  echo "  DATABASE_URL=postgresql://$APP_DB_USER:$APP_DB_PASS@localhost:15432/$APP_DB_NAME"
  echo ""
  echo "Local command to access the database via psql:"
  echo "  PGUSER=$APP_DB_USER PGPASSWORD=$APP_DB_PASS psql -h localhost -p 15432 $APP_DB_NAME"
}

print_node_install () {
  echo "Installing Node.js server and project(s)"
  echo "All the Node.js junk is installed, server should be runnable from project dir"
  echo "using this command: nodejs bin/www"
}

export DEBIAN_FRONTEND=noninteractive

PROVISIONED_ON=/etc/vm_provision_on_timestamp
if [ -f "$PROVISIONED_ON" ]
then
  echo "VM was already provisioned at: $(cat $PROVISIONED_ON)"
  echo "To run system updates manually login via 'vagrant ssh' and run 'apt-get update && apt-get upgrade'"
  echo ""
  print_db_usage
  exit
fi

PG_REPO_APT_SOURCE=/etc/apt/sources.list.d/pgdg.list
if [ ! -f "$PG_REPO_APT_SOURCE" ]
then
  # Add PG apt repo:
  echo "deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main" > "$PG_REPO_APT_SOURCE"

  # Add PGDG repo key:
  wget --quiet -O - https://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add -
fi

apt-get -y install "postgresql-$PG_VERSION" "postgresql-contrib-$PG_VERSION" > /dev/null

PG_CONF="/etc/postgresql/$PG_VERSION/main/postgresql.conf"
PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
PG_DIR="/var/lib/postgresql/$PG_VERSION/main"
PG_PASS="$HOME/.pgpass"

# Edit postgresql.conf to change listen address to '*':
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"
# TODO: Also, Edit postgresql.conf to change the default port to 15432 instead of 5432

# Append to pg_hba.conf to add password auth:
echo "host    all             all             all                     md5" >> "$PG_HBA"

# Explicitly set default client_encoding
echo "client_encoding = utf8" >> "$PG_CONF"

echo "localhost:5432:$APP_DB_NAME:$APP_DB_USER:$APP_DB_PASS" >> "$PG_PASS"
chmod 0600 $PG_PASS

# Restart so that all new config is loaded:
service postgresql restart

cat << EOF | su - postgres -c psql
-- Create the database user:
CREATE USER $APP_DB_USER WITH PASSWORD '$APP_DB_PASS';

-- Create the database:
CREATE DATABASE $APP_DB_NAME WITH OWNER=$APP_DB_USER
                                  LC_COLLATE='en_US.utf8'
                                  LC_CTYPE='en_US.utf8'
                                  ENCODING='UTF8'
                                  TEMPLATE=template0;

\connect $APP_DB_NAME;

-- Create the users&user_locations tables:
CREATE TABLE users
(
  user_id serial NOT NULL,
  uuid uuid,
  fullname character varying(100) NOT NULL,
  username character varying(50) NOT NULL,
  password character varying(100) NOT NULL,
  email character varying(355) NOT NULL,
  created_on timestamp without time zone NOT NULL,
  last_login timestamp without time zone,
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_username_key UNIQUE (username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO $APP_DB_USER;
GRANT ALL ON TABLE users TO $APP_DB_USER;

CREATE TABLE user_locations
(
  location_id serial NOT NULL,
  user_uuid uuid NOT null,
  created_on timestamp without time zone NOT NULL,
  longitude float8,
  latitude float8,
  elevation float8,
  CONSTRAINT user_locations_pkey PRIMARY KEY (location_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE user_locations
  OWNER TO $APP_DB_USER;
GRANT ALL ON TABLE user_locations TO $APP_DB_USER;

EOF

# Tag the provision time:
date > "$PROVISIONED_ON"

echo "Successfully created PostgreSQL dev virtual machine."
echo ""
print_db_usage

#apt-get update
sudo apt-get -y install g++ > /dev/null
#curl -sL https://deb.nodesource.com/setup_0.12 | sh
curl -sL https://deb.nodesource.com/setup_5.x | sh
sudo apt-get -y install nodejs > /dev/null
su vagrant
mkdir /home/vagrant/node_modules
ln -s /home/vagrant/node_modules/ node_modules
npm install > /dev/null
cd ../node_modules
npm install bcrypt
print_node_install

#SHELL
echo "Provisioning Completed"
