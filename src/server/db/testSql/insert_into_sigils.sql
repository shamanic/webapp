insert into sigils (
  --sigil_id, --autogenerates
  sigil_uuid,
  user_uuid,
  sigil_location, --location on map, eventually this may need to be expanded to include areas / geometries
  name,
  url)
  VALUES
  (
    uuid_generate_v1()
    ,(SELECT uuid FROM users WHERE username = 'davidthevagrant')
    ,2
    ,'sacred kittensigil number one'
    ,'http://placekitten.com/201/201'
  );