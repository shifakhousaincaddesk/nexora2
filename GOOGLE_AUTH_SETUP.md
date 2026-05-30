# Google Signup Setup

This app signs users up with Supabase Google OAuth from `/auth` and redirects successful Google signups to `/onboarding`.

## 1. Google Cloud Console

1. Open Google Cloud Console.
2. Create or select a project.
3. Configure the OAuth consent screen.
4. Create an OAuth Client ID:
   - Application type: `Web application`
   - Client ID:
     - `232692583108-aklrnjjeus34afr4v65nglojq5ghk820.apps.googleusercontent.com`
   - Authorized JavaScript origins:
     - `http://localhost:8080`
     - `http://127.0.0.1:8080`
     - `http://127.0.0.1:5173`
     - `http://localhost:5173`
     - Your production domain
   - Authorized redirect URI:
     - `https://ooenywwhwfmdomainbuc.supabase.co/auth/v1/callback`
5. Copy the Google Client ID and Client Secret.

## 2. Supabase Dashboard

1. Go to `Authentication > Providers > Google`.
2. Enable Google.
3. Paste the Google Client ID:
   - `232692583108-aklrnjjeus34afr4v65nglojq5ghk820.apps.googleusercontent.com`
4. Paste your Google Client Secret from Google Cloud Console.
5. Go to `Authentication > URL Configuration`.
6. Set the Site URL for production.
7. Add Redirect URLs:
   - `http://localhost:8080/onboarding`
   - `http://127.0.0.1:8080/onboarding`
   - `http://127.0.0.1:5173/onboarding`
   - `http://localhost:5173/onboarding`
   - `https://<your-production-domain>/onboarding`

## 3. App Environment

The app reads Supabase from these variables:

```env
VITE_SUPABASE_URL=https://<your-supabase-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
SUPABASE_URL=https://<your-supabase-project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
GOOGLE_OAUTH_CLIENT_ID=232692583108-aklrnjjeus34afr4v65nglojq5ghk820.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=<add-your-google-client-secret-here-for-local-reference-only>
```

Google Client ID and Client Secret stay in Supabase for the actual OAuth flow. Do not expose the Google Client Secret in frontend code or any `VITE_*` variable.

For convenience, this repo includes `.env.local` with:

```env
GOOGLE_OAUTH_CLIENT_ID=232692583108-aklrnjjeus34afr4v65nglojq5ghk820.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=replace-with-your-google-client-secret
```

Replace the secret locally, then copy the same secret into Supabase `Authentication > Providers > Google`.
