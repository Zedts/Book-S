# Lessons Learned

## Supabase Custom Tables & Row Level Security (RLS)
**Issue:** `Database error querying schema` happens after creating a custom table (`public.users`) and enabling RLS, especially when the Supabase client fetches data via anonymous or authenticated sessions.

**Root Cause:**
By default, creating a completely new table or schema running pure SQL might not automatically grant PostgREST roles the ability to access data, even if RLS is enabled and policies are defined. RLS dictates *which rows* can be seen, but the *role* needs basic PostgreSQL `SELECT`, `INSERT`, etc., privileges.

**Solution/Pattern:**
Always explicitly grant permissions to `anon` and `authenticated` roles after defining a new custom table:
```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.[table_name] TO anon, authenticated;
```
This should be standard practice when bootstrapping a custom `public.*` table using SQL over MCP.

## Supabase GoTrue Auth Internal 500 Error
**Issue:**
`500 Internal Server Error`, `{"code":"unexpected_failure","message":"Database error querying schema"}`
Occurs when trying to authenticate (`grant_type=password` on `/auth/v1/token`), even though email and password are correct.

**Root Cause:**
If you create rows in `auth.users` manually via raw SQL (e.g., seeding testing data) without going through the standard Supabase Auth API, columns such as `confirmation_token`, `recovery_token`, etc., will default to `NULL`. The GoTrue auth engine throws a generic database querying schema error because it crashes trying to parse `NULL` on these internal token columns.

**Solution/Pattern:**
Never leave these fields as `NULL` if you manually inject user test data. Ensure that they are defaulted to an empty string `''`:
```sql
UPDATE auth.users
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, '')
WHERE 
  confirmation_token IS NULL OR recovery_token IS NULL;
```

## 3. RLS Infinite Recursion (Error 42P17)
**Issue:**
Terjadi error dengan pesan `infinite recursion detected in policy for relation "[table_name]"`. Modifikasi ini paling sering muncul saat menjalankan `GET` request menggunakan Supabase Client terhadap tabel (misalnya `users`), yang mana memiliki RLS *policy* yang mereferensikan tabel itu sendiri.

**Root Cause:**
Jika *policy* "User requires Admin role" mengeksekusi `SELECT role FROM public.users WHERE id = auth.uid()`, setiap evaluasi *row* tabel akan memicu *policy* ini lagi. *Policy* ini pada gilirannya me-*trigger* *SELECT* lagi, dan RLS me-*loop* perintah secara infinit (*infinite recursion*).

**Solution/Pattern:**
Jangan pernah mendelegasi logika pengecekan dari tabel ke tabel yang sama secara terbuka. Alihkan pengecekan ke dalam parameter fungsi bawaan Postgres dengan atribut `SECURITY DEFINER`. `SECURITY DEFINER` mengeksekusi *query* sebagai "super user/creator" sehingga mem-*bypass* logika RLS *policy*, sehingga siklus rekursi dapat diputus:
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;
```
Kemudian di Dashboard Supabase atau Migrasi MCP, *drop policy* lama Anda dan _recreate_ dengan memanggil *function* baru tersebut: `USING (public.is_admin())`.
