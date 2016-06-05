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

--do LANGUAGE plpgSQL $$
  -- DECLARE
  -- uid uuid := '39db4810-2512-11e6-9a7c-5dfed796f5d5';
  -- location_id bigint := 4;

-- do language plpgsql $$
--     begin
--         -- Yes, I have a table called pancakes in my playpen database.
--         if (select count(*) from pancakes) > 0 then
--             raise notice 'Got some';
--             if (select 1 from pancakes WHERE fluffiness < 0.75) THEN
--               raise notice 'not that fluffy, though.';
--             END if;
--         else
--             raise notice 'Got none';
--         end if;
--     end;
-- $$;