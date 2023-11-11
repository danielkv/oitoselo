create view
  public.profiles as
select
  users.id,
  users.email,
  users.last_sign_in_at,
  users.raw_app_meta_data,
  (users.raw_user_meta_data -> 'displayName') #>> '{}' as "displayName",
  (users.raw_user_meta_data -> 'disabled')::boolean as disabled,
  (users.raw_user_meta_data -> 'username') #>> '{}' as username,
  (users.raw_user_meta_data -> 'photoURL') #>> '{}' as "photoURL",
  users.created_at,
  users.phone
from
  auth.users;