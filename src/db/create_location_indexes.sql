
CREATE INDEX geometry_idx
    ON public.user_locations USING gist
    (geom)
    TABLESPACE pg_default;


CREATE INDEX location_id_user_uuid_idx
    ON public.user_locations USING btree
    (location_id, user_uuid)
    TABLESPACE pg_default;


CREATE UNIQUE INDEX user_uuid_created_on_uidx
    ON public.user_locations USING btree
    (user_uuid, created_on)
    TABLESPACE pg_default;
