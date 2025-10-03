# Check Vercel Environment Variables

## Vấn Đề:
Local có data mới, Vercel không có → Do dùng 2 Supabase projects khác nhau

---

## Bước 1: Kiểm Tra Vercel Env

1. **Vào Vercel Dashboard:**
   ```
   https://vercel.com → Project thelabperfume → Settings → Environment Variables
   ```

2. **Check 2 biến:**
   ```
   VITE_SUPABASE_URL = ?
   VITE_SUPABASE_ANON_KEY = ?
   ```

3. **So sánh với Local (.env):**
   ```
   VITE_SUPABASE_URL=https://gjmfdcqmnrihnxjemqfl.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Bước 2: Fix

### Nếu URL KHÁC NHAU:

**Case A: Muốn dùng chung 1 Supabase (Recommended)**

1. Update Vercel env về giống local
2. Redeploy

**Case B: Cố tình dùng 2 Supabase (Dev vs Prod)**

1. Tạo perfume trên production database
2. Hoặc migrate data từ dev → prod

### Nếu URL GIỐNG NHAU:

→ Vercel cache cũ

1. Vào Vercel Deployments
2. Click "Redeploy" (không cần thay đổi gì)
3. Wait deploy xong
4. Hard refresh browser: Ctrl+Shift+R

---

## Bước 3: Test

```
https://thelabperfume.vercel.app/browse
```

Phải thấy perfume SANTAL 33 ✅

---

## Debug Commands

### Check production API:
```bash
# Vercel đang dùng Supabase nào?
curl https://thelabperfume.vercel.app/_next/static/chunks/main.js | grep SUPABASE_URL
```

### Direct Supabase test:
```bash
curl https://gjmfdcqmnrihnxjemqfl.supabase.co/rest/v1/perfumes?select=*
```

---

## Checklist

- [ ] Vercel env vars checked
- [ ] VITE_SUPABASE_URL khớp với local
- [ ] VITE_SUPABASE_ANON_KEY khớp với local
- [ ] Vercel redeployed
- [ ] Browser hard refresh (Ctrl+Shift+R)
- [ ] Production shows new perfume ✅
