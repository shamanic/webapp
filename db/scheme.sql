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
  OWNER TO shamanic_user;
GRANT ALL ON TABLE users TO shamanic_user;
