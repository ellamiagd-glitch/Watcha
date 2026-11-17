-- WhosView — demo seed data. Run AFTER schema.sql.
-- Safe to re-run: it clears the demo tables first. It does NOT touch auth users.

truncate list_items, list_likes, lists, activity, friendships, titles, profiles
  restart identity cascade;

-- Titles ---------------------------------------------------------------------
insert into titles (name, type, year, service, runtime_mins, genres, tagline) values
  ('The Silent Harbor','show',2025,'Netflix',52,'{Thriller,Mystery}','Everyone in town is lying.'),
  ('Neon Avenue','movie',2024,'Max',128,'{Sci-Fi,Action}','The future has a pulse.'),
  ('Last Orders','show',2026,'Prime Video',44,'{Drama,Comedy}','A pub. A family. A reckoning.'),
  ('Paper Kingdom','show',2025,'Apple TV+',58,'{Drama}','Power is a paper crown.'),
  ('Midnight Cartographer','movie',2023,'Netflix',117,'{Adventure,Drama}','Some maps lead inward.'),
  ('Glasshouse','show',2024,'Hulu',49,'{Horror,Mystery}','Nothing stays hidden in the light.'),
  ('The Understudy','movie',2026,'Disney+',104,'{Comedy,Romance}','Second billing, first love.'),
  ('Ironwood','show',2022,'Max',55,'{Western,Drama}','The frontier keeps its debts.'),
  ('Saltwater','movie',2025,'Apple TV+',112,'{Drama,Romance}','The tide always comes back.'),
  ('Protocol Seven','show',2026,'Prime Video',47,'{Sci-Fi,Thriller}','Trust the system. It''s listening.'),
  ('Honey & Smoke','show',2025,'Netflix',31,'{Comedy}','A kitchen at war with itself.'),
  ('The Long Field','movie',2021,'Hulu',134,'{Drama}','Home is a direction, not a place.'),
  ('Cold Open','show',2024,'Max',38,'{Comedy,Drama}','Live from the edge of a breakdown.'),
  ('Verdigris','movie',2026,'Disney+',141,'{Fantasy,Adventure}','The green runs deep.'),
  ('Static Bloom','show',2025,'Apple TV+',51,'{Sci-Fi,Drama}','Love in a signal that won''t die.'),
  ('Nightmarket','show',2023,'Netflix',46,'{Crime,Thriller}','Everything''s for sale after dark.');

-- Profiles (demo accounts; auth_id null until a real user links in) ----------
insert into profiles (username, display_name, bio) values
  ('ella','Ella','Slow TV, fast gin. Lover of a limited series and a good twist.'),
  ('mia','Mia Chen','Horror in October, rom-coms the rest of the year.'),
  ('theo','Theo Park','If it has a heist, I''m in.'),
  ('sana','Sana Ali','Prestige drama apologist.'),
  ('jon','Jon Reyes','Documentaries & anything with a map on the poster.'),
  ('priya','Priya Nair','Comfort shows on loop. Ask me about my rewatch count.'),
  ('leo','Leo Fontaine','Sci-fi, sport docs, and exactly one cooking show.');

-- Friendships (directed; mirrors the app's friend lists) ---------------------
insert into friendships (user_id, friend_id)
select a.id, b.id from profiles a join profiles b on true
where (a.username, b.username) in (
  ('ella','mia'),('ella','theo'),('ella','sana'),('ella','jon'),('ella','priya'),('ella','leo'),
  ('mia','ella'),('mia','theo'),('mia','leo'),
  ('theo','ella'),('theo','mia'),('theo','sana'),
  ('sana','ella'),('sana','theo'),('sana','priya'),
  ('jon','ella'),('jon','priya'),
  ('priya','ella'),('priya','jon'),('priya','sana'),
  ('leo','ella'),('leo','mia')
);

-- Lists ----------------------------------------------------------------------
insert into lists (owner_id, title, description, likes)
select p.id, v.title, v.description, v.likes
from (values
  ('ella','Twist endings that earned it','No cheap gotchas — finales that recontextualise everything you watched.',214),
  ('sana','Prestige drama starter pack','If you''re new to the good stuff, start here.',388),
  ('priya','Comfort rewatches','Low stakes, high warmth. On in the background, in my heart forever.',176),
  ('leo','Sci-fi that respects you','Big ideas, no hand-holding.',452),
  ('theo','One perfect heist','Films and shows built around a single beautiful job.',129),
  ('mia','Lights off, volume up','Horror and dread, best watched between your fingers.',301)
) as v(owner, title, description, likes)
join profiles p on p.username = v.owner;

-- List items -----------------------------------------------------------------
insert into list_items (list_id, title_id, rank)
select l.id, t.id, v.rank
from (values
  ('Twist endings that earned it','The Silent Harbor',0),
  ('Twist endings that earned it','Glasshouse',1),
  ('Twist endings that earned it','Protocol Seven',2),
  ('Twist endings that earned it','Nightmarket',3),
  ('Twist endings that earned it','Paper Kingdom',4),
  ('Prestige drama starter pack','Paper Kingdom',0),
  ('Prestige drama starter pack','Ironwood',1),
  ('Prestige drama starter pack','Saltwater',2),
  ('Prestige drama starter pack','The Long Field',3),
  ('Comfort rewatches','Honey & Smoke',0),
  ('Comfort rewatches','Last Orders',1),
  ('Comfort rewatches','Cold Open',2),
  ('Comfort rewatches','The Understudy',3),
  ('Sci-fi that respects you','Neon Avenue',0),
  ('Sci-fi that respects you','Protocol Seven',1),
  ('Sci-fi that respects you','Static Bloom',2),
  ('Sci-fi that respects you','Verdigris',3),
  ('One perfect heist','Neon Avenue',0),
  ('One perfect heist','Nightmarket',1),
  ('One perfect heist','Midnight Cartographer',2),
  ('Lights off, volume up','Glasshouse',0),
  ('Lights off, volume up','The Silent Harbor',1),
  ('Lights off, volume up','Nightmarket',2)
) as v(list_title, title_name, rank)
join lists l on l.title = v.list_title
join titles t on t.name = v.title_name;

-- Activity (updated_at offset from now by the given minutes) ------------------
insert into activity (user_id, title_id, status, progress, season, episode, episode_title, started_at, updated_at)
select p.id, t.id, v.status, v.progress, v.season, v.episode, v.episode_title,
       now() - (v.mins || ' minutes')::interval,
       now() - (v.mins || ' minutes')::interval
from (values
  ('mia','The Silent Harbor','watching',38,2,4,'The Fog Returns',2),
  ('leo','Protocol Seven','watching',61,1,7,'Failsafe',5),
  ('priya','Honey & Smoke','watching',12,3,2,'The Sous-Chef Incident',1),
  ('theo','Neon Avenue','watching',74,null,null,null,9),
  ('sana','Paper Kingdom','finished',100,1,10,'Coronation',48),
  ('jon','Midnight Cartographer','finished',100,null,null,null,95),
  ('mia','Glasshouse','finished',100,1,6,'Daylight',190),
  ('priya','Last Orders','finished',100,2,1,'Reopening',320),
  ('theo','Nightmarket','finished',100,1,8,null,540),
  ('leo','Static Bloom','finished',100,1,3,'Carrier Wave',1510),
  ('ella','Saltwater','finished',100,null,null,null,60),
  ('ella','The Silent Harbor','watching',20,2,2,'Low Tide',1400)
) as v(username, title_name, status, progress, season, episode, episode_title, mins)
join profiles p on p.username = v.username
join titles t on t.name = v.title_name;
