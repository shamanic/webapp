CREATE OR REPLACE FUNCTION upsert_basecamp_add_location_if_not_exists(uid uuid, location_id bigint, ) RETURNS void AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM locations_metadata WHERE user_uuid = uid AND is_basecamp = true) THEN
    RAISE NOTICE 'basecamp location in database, disabling old one';
    UPDATE locations_metadata SET is_basecamp = false WHERE user_uuid = uid;
    IF EXISTS (SELECT 1 FROM locations_metadata WHERE user_uuid = uid AND user_locations_id = location_id) THEN
      UPDATE locations_metadata SET is_basecamp = true WHERE user_uuid = uid AND user_locations_id = location_id;
    ELSE
      INSERT INTO user_locations (--..i don't know where to get these parameters from)
      INSERT INTO locations_metadata (user_locations_id,
                                      user_uuid,
                                      is_basecamp,
                                      assigned_basecamp_on)
      SELECT location_id, uid, true, current_timestamp;
    END IF;
  ELSE
    INSERT INTO locations_metadata (user_locations_id,
                                      user_uuid,
                                      is_basecamp,
                                      assigned_basecamp_on)
      SELECT location_id, uid, true, current_timestamp;
  END IF;
END;
$$ LANGUAGE plpgsql;