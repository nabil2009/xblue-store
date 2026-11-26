# xBlue Studio

Next.js 14 (App Router) + TypeScript + Tailwind + NextAuth (Discord) + Supabase. Serverless، جاهز لـ Vercel.

## 0) الملفات المطلوبة منك
ضع `logo.png` (شفاف) و `banner.png` داخل مجلد `public/`.

## 1) تشغيل محلي
```bash
npm install
cp .env.example .env.local   # عبّئ القيم
npm run dev                   # أو: npm run build && npm start
```
محلياً غيّر `NEXTAUTH_URL=http://localhost:3000` وأضف `http://localhost:3000/api/auth/callback/discord` في Discord.

## 2) Discord Developer Portal
1. https://discord.com/developers/applications ← New Application ← xBlue Studio
2. OAuth2 ← انسخ **Client ID** و **Client Secret** (Reset Secret)
3. OAuth2 ← Redirects ← Add Redirect: `https://YOUR-SITE.vercel.app/api/auth/callback/discord` ثم Save
4. الصلاحيات (identify + guilds) يطلبها الكود تلقائياً.
5. `NEXTAUTH_SECRET`: نفّذ `openssl rand -base64 32`

## 3) Supabase
1. أنشئ مشروعاً على supabase.com
2. SQL Editor ← الصق محتوى `schema.sql` ← Run (ينشئ الجدولين وbucket اسمه `projects` عام)
3. Project Settings ← API: انسخ **Project URL** إلى `SUPABASE_URL` و **service_role key** إلى `SUPABASE_SERVICE_ROLE_KEY` (سري، للسيرفر فقط)

## 4) Webhook
قناة الإدارة ← Edit Channel ← Integrations ← Webhooks ← New Webhook ← Copy URL إلى `DISCORD_WEBHOOK_URL`

## 5) النشر على Vercel
1. ارفع المشروع على GitHub (`.env.local` مستثنى تلقائياً)
2. Vercel ← Add New Project ← اختر المستودع
3. Settings ← Environment Variables: أضف كل متغيرات `.env.example`
4. Deploy، ثم ضع رابط الموقع الفعلي في `NEXTAUTH_URL` و `DISCORD_REDIRECT_URI` وأضف الـ Redirect في Discord Portal، وأعد النشر.
