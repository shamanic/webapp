CREATE TABLE sigils
(
  sigil_id serial NOT NULL,
  sigil_uuid uuid NOT NULL,
  user_uuid uuid NOT NULL,
  sigil_location bigint NULL, --location on map, eventually this may need to be expanded to include areas / geometries
  name character varying(200) NULL,
  url character varying(500) NULL,
  CONSTRAINT sigils_pkey PRIMARY KEY (sigil_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sigils
  OWNER TO vagrant;
GRANT ALL ON TABLE sigils TO vagrant;
