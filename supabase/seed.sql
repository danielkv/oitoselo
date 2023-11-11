INSERT INTO auth.users (instance_id,id,aud,"role",email,encrypted_password,email_confirmed_at,last_sign_in_at,raw_app_meta_data,raw_user_meta_data,is_super_admin,created_at,updated_at,phone,phone_confirmed_at,confirmation_token,email_change,email_change_token_new,recovery_token) VALUES
	('00000000-0000-0000-0000-000000000000'::uuid,'f76629c5-a070-4bbc-9918-64beaea48848'::uuid,'authenticated','authenticated','danielkv@gmail.com','$2a$10$Kd89OeMB/Bq6NVTRMjsw4OHerR9L9ZMzhP29bueHKa9FgUa5CVz2C',NOW(),NOW(),'{"provider": "email", "providers": ["email"], "userrole": "default", "claims_admin": true}','{"displayName":"Daniel Kozuchovski Guolo","disabled":false,"username":""}',FALSE,NOW(),NOW(),NULL,NULL,'','','','')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id,user_id,identity_data,provider,last_sign_in_at,created_at,updated_at) VALUES
	('f76629c5-a070-4bbc-9918-64beaea48848','f76629c5-a070-4bbc-9918-64beaea48848'::uuid,'{"sub": "f76629c5-a070-4bbc-9918-64beaea48848"}','email',NOW(),NOW(),NOW())
ON CONFLICT (id, provider) DO NOTHING;