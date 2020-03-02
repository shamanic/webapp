CREATE OR REPLACE FUNCTION calc_geom_column(user_locations text, row_id integer)
RETURNS geometry(Point,4326) AS
	$$
	DECLARE rid integer;
	lon double precision;
	lat double precision;
	pt geometry(Point,4326);
BEGIN
	rid := row_id;
	lon := (SELECT longitude
				FROM user_locations
				WHERE location_id = rid);
	lat := (SELECT latitude
				FROM user_locations
				WHERE location_id = rid);
	pt := (SELECT ST_SetSRID(ST_MAKEPOINT(lon, lat), 4326));

IF pt IS NOT NULL
THEN
	UPDATE user_locations
	SET geom = pt
	WHERE location_id = rid;
	RETURN pt;
ELSE
	RETURN NULL;
END IF;
END;
$$ LANGUAGE plpgsql;