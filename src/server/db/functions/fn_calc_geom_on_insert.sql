CREATE OR REPLACE FUNCTION fn_calc_geom_on_insert() RETURNS TRIGGER AS $$
DECLARE
BEGIN
START TRANSACTION;
  INSERT INTO
    user_locations ( geom )
    VALUES
        -- NEW.point.elevation,
        st_geomfromtext()
        -- st_setsrid(
        --     st_makepoint(
        --          st_x(NEW.point.geom),
        --          st_y(NEW.point.geom),
        --          NEW.point.elevation
        --     ),
        -- 25830);
    RETURN new;
END;