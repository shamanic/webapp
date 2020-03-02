SELECT jsonb_build_object(
  'type','Topology',
  'transform',jsonb_build_object('scale', to_jsonb('{0.001546403012701271,0.0010939367048704803}'::double precision[]),
    'translate',to_jsonb('{-13.69131425699993,49.90961334800009}'::double precision[])
  ),
  'objects',jsonb_build_object('subunits', jsonb_build_object('type', 'MultiPolygon',
    'id',user_uuid),
    'places', jsonb_build_object('type', 'GeometryCollection',
      'geometries',json_agg(ST_AsGeoJSON(geom))
    )
  )
)
FROM user_locations
WHERE user_uuid = (SELECT uuid
									 FROM users
									 WHERE username = 'davidthevagrant')
GROUP BY user_uuid;


COPY
(SELECT row_to_json(fc)
 FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
 FROM (SELECT 'Feature' As type
    	-- , json_agg(ST_AsGeoJSON(lg.geog))::json As geography
    	, ST_AsGeoJSON(lg.geom)::json AS geometry
    	, row_to_json(lp) As properties
   		 FROM user_locations As lg
       INNER JOIN
       	(SELECT location_id, properties FROM user_locations) As lp
       	ON lg.location_id = lp.location_id
       	WHERE lg.user_uuid = (SELECT uuid
      									 FROM users
      									 WHERE username = 'davidthevagrant'
      	)
      ) As f
      ) As fc)
TO '/Users/david/workspace/shamanic/webapp/server/db/db_output/test_geojson.json';

COPY
(SELECT row_to_json(coll) FROM
(select st_multi(st_collect(f.geom)) as singlegeom FROM (select location_id, geom AS geom FROM user_locations) AS f) AS coll)
TO '/Users/david/workspace/shamanic/webapp/server/db/db_output/single_geom.json';
 -- LIMIT 3;

COPY
(SELECT ST_AsGeoJSON(st_linefrommultipoint(st_multi(st_collect(f.geom)))) FROM user_locations AS f)
TO '/Users/david/workspace/shamanic/webapp/server/db/db_output/single_geom.json';


SELECT row_to_json(lp) AS properties
FROM user_locations AS lp
WHERE user_uuid = (SELECT uuid
									 FROM users
									 WHERE username = 'davidthevagrant'
)
LIMIT 3;