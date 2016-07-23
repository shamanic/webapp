-- solution one:
-- build a unique index such that, in locations_metadata only one record may have the combination
-- user_uuid + location_id + is_basecamp
-- this solution has the problem that it's not clear how to ensure that the next thing that happens,
-- besides the first function failing, is that the row marked is_basecamp gets disabled and the new
-- basecamp gets enabled

SELECT *
                   FROM locations_metadata
                   INNER JOIN users ON
                    (users.uuid = locations_metadata.user_uuid
                    AND locations_metadata.is_basecamp = true);

user_locations_id: location.location_id };
    basecampObj.is_basecamp = true;
    basecampObj.assigned_basecamp_on = new req.db.DBExpr('NOW()');
    basecampObj.user_uuid = req.session.user.uuid;
INSERT INTO locations_metadata (
  user_locations_id,
  user_uuid,
  is_basecamp,
  assigned_basecamp_on)
SELECT location_id, user_uuid, true, current_timestamp FROM user_locations
AS a CROSS JOIN users AS b WHERE a.user_uuid = b.uuid;