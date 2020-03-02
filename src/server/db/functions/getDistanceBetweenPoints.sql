CREATE OR REPLACE FUNCTION distance_between_points(loc1_id integer, loc2_id integer)
RETURNS double precision AS
	$$
	DECLARE dist double precision;
 					loc1 geometry(Point,4326);
 					loc2 geometry(Point,4326);
BEGIN
	loc1 := (SELECT geom
				FROM user_locations
				WHERE location_id = loc1_id);
	loc2 := (SELECT geom
				FROM user_locations
				WHERE location_id = loc2_id);
	dist := (SELECT ST_DistanceSpheroid(loc1, loc2, 'SPHEROID["WGS 84",6378137,298.257223563]'));

IF dist IS NOT NULL
THEN
	RETURN dist;
ELSE

	RETURN NULL;
END IF;
END;
$$ LANGUAGE plpgsql;