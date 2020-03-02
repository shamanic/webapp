CREATE TABLE users
(
  id serial NOT NULL,
  uuid uuid NOT NULL,
  fullname character varying(100) NOT NULL,
  username character varying(50) NOT NULL,
  password character varying(100) NOT NULL,
  email character varying(355) NOT NULL,
  created_on timestamp without time zone NOT NULL,
  last_login timestamp without time zone, --nullable, by default - other nullable columns follow as '[name] [datatype]'
  is_admin boolean NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_username_key UNIQUE (username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO shamanic_user;
GRANT ALL ON TABLE users TO shamanic_user;

CREATE TABLE user_locations
(
  id serial NOT NULL,
  user_uuid uuid NOT null, --there is some idea that there can or should be a way to have a location which is not
                            --tied to any particular user - a "system_uuid" perhaps, if we leave these as NOT NULL
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
  OWNER TO shamanic_user;
GRANT ALL ON TABLE user_locations TO shamanic_user;

CREATE TABLE users_metadata
(
  id serial NOT NULL,
  user_uuid uuid NOT NULL,
  current_basecamp_id bigint, --fk to locations_metadata table where is_basecamp = true (nullable for "nomadic mode")
  current_location bigint NOT NULL, --fk to user_locations, to determine distance to relevant points
  --really, the current_location should have to be in another kind of database, in-memory and pushed to
  --the user_locations table - the idea is to determine relationships between the user's current location and their
  --marked goals or locations similar to them. etc.
  CONSTRAINT users_metadata_pkey PRIMARY KEY (user_metadata_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users_metadata
  OWNER TO shamanic_user;
GRANT ALL ON TABLE users_metadata TO shamanic_user;

CREATE TABLE locations_metadata
(
  id serial NOT NULL,
  user_locations_id bigint NOT NULL, --fk to user_locations master table
  user_uuid uuid NOT NULL,
  is_basecamp boolean NOT NULL,
  assigned_basecamp_on timestamp without time zone,
  number_of_users bigint, --tracks how many users have hit this point
  average_time_between_locations interval, --how long on average each point is updated (this kind of data can be used
                                           --to guess how people are moving around, perhaps.) could also be calculated
  basecamp_icon_url character varying(500),
  CONSTRAINT users_metadata_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE locations_metadata
  OWNER TO shamanic_user;
GRANT ALL ON TABLE locations_metadata TO shamanic_user;


CREATE TABLE sigils --the 'platonic' version of a sigil with which a player can play / cast spells
(
  sigil_id serial NOT NULL,
  sigil_uuid uuid NOT NULL,
  user_uuid uuid NOT NULL,
  sigil_location bigint, --location on map, eventually this may need to be expanded to include areas / geometries
  name character varying(200),
  url character varying(500),
  number_of_strokes integer,
  CONSTRAINT sigils_pkey PRIMARY KEY (sigil_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sigils
  OWNER TO shamanic_user;
GRANT ALL ON TABLE sigils TO shamanic_user;
)

CREATE TABLE sigil_strokes
(
  stroke_id serial NOT NULL,
  sigil_uuid uuid NOT NULL,
  direction_of_stroke character varying(100) NOT NULL,
  array_of_pixels character varying(8000) NOT NULL,
  CONSTRAINT sigil_strokes_pkey PRIMARY KEY (stroke_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sigil_strokes
  OWNER TO shamanic_user;
GRANT ALL ON TABLE sigil_strokes TO shamanic_user;
)

CREATE TABLE sigils_metadata --to track how many times they have been used, or failed to use
(
  id serial NOT NULL,
  sigil_uuid uuid NOT NULL,
  number_of_failures bigint,
  number_of_successes bigint,
  domain_of_magic character varying(100),
  CONSTRAINT sigils_metadata_pkey PRIMARY KEY (sigil_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sigils_metadata
  OWNER TO shamanic_user;
GRANT ALL ON TABLE sigils_metadata TO shamanic_user;
)
