CREATE OR REPLACE FUNCTION basecampTestProc(uid uuid, location_id bigint) RETURNS void AS $$

BEGIN
  IF EXISTS (SELECT 1 FROM locations_metadata WHERE user_uuid = uid AND is_basecamp = true) THEN
      RAISE NOTICE 'basecamp location in database, disabling old one';
      IF EXISTS (SELECT 1 FROM locations_metadata WHERE user_uuid = uid AND user_locations_id = location_id) THEN
        RAISE NOTICE 'updating existing location to be basecamp';
      ELSE
        RAISE NOTICE 'inserting new location as basecamp';
      END IF;
    ELSE
      RAISE NOTICE 'no basecamp selected, inserting new location as basecamp';
  END IF;
END;
$$ LANGUAGE plpgSQL;
