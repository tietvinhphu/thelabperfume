# Hướng Dẫn Deploy Lên Vercel

## Bước 1: Chuẩn Bị

### 1.1. Đăng Ký Tài Khoản Vercel
- Truy cập: https://vercel.com
- Click "Sign Up" và đăng ký bằng GitHub account (khuyến nghị)
- Xác thực email nếu cần

### 1.2. Push Code Lên GitHub
```bash
# Kiểm tra git status
git status

# Add các file mới (vercel.json)
git add .

# Commit
git commit -m "Add Vercel deployment configuration"

# Push lên GitHub
git push origin main
```

## Bước 2: Import Project Vào Vercel

### 2.1. Tạo Project Mới
1. Đăng nhập vào Vercel Dashboard
2. Click nút **"Add New..."** → **"Project"**
3. Chọn repository `thelabperfume` từ danh sách GitHub repos
4. Click **"Import"**

### 2.2. Cấu Hình Project

#### Framework Preset:
- Vercel sẽ tự động detect: **Vite**
- Giữ nguyên các settings mặc định:
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Install Command:** `npm install`

#### Environment Variables (QUAN TRỌNG):
Click **"Environment Variables"** và thêm:

```
VITE_SUPABASE_URL = your_supabase_project_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

**Lấy giá trị từ đâu?**
- Đăng nhập Supabase: https://supabase.com/dashboard
- Chọn project của bạn
- Vào **Settings** → **API**
- Copy:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 2.3. Deploy
1. Click nút **"Deploy"**
2. Đợi 2-3 phút để build và deploy
3. Vercel sẽ cung cấp URL dạng: `https://thelabperfume.vercel.app`

## Bước 3: Cấu Hình Domain (Tùy Chọn)

### 3.1. Dùng Domain Miễn Phí Của Vercel
- URL mặc định: `https://thelabperfume.vercel.app`
- Hoặc custom subdomain: `https://your-custom-name.vercel.app`

### 3.2. Dùng Domain Riêng
1. Vào **Settings** → **Domains**
2. Nhập domain của bạn (vd: `thelabperfume.com`)
3. Làm theo hướng dẫn của Vercel để cấu hình DNS

## Bước 4: Cấu Hình Supabase CORS

### 4.1. Thêm Domain Vào Allowed Origins
1. Vào Supabase Dashboard
2. Chọn project → **Settings** → **API**
3. Scroll xuống **"URL Configuration"**
4. Thêm Vercel URL vào **"Site URL"**:
   ```
   https://thelabperfume.vercel.app
   ```

5. Scroll xuống **"Redirect URLs"**
6. Thêm URL:
   ```
   https://thelabperfume.vercel.app/*
   ```

## Bước 5: Auto Deploy (Tự Động)

Sau khi setup xong, mỗi khi bạn push code lên GitHub:
```bash
git add .
git commit -m "Update features"
git push origin main
```

Vercel sẽ **TƯ ĐỘNG**:
- Phát hiện code mới
- Build project
- Deploy lên production
- Thông báo qua email

## Bước 6: Preview Deployments

Khi tạo Pull Request trên GitHub:
- Vercel tự động tạo **preview URL** riêng
- Test tính năng mới trước khi merge
- Preview URL dạng: `https://thelabperfume-git-feature-branch.vercel.app`

## Troubleshooting

### Lỗi Build Failed
```bash
# Kiểm tra build local trước:
npm run build

# Nếu thành công → vấn đề là environment variables
# Check lại VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY
```

### Lỗi 404 Khi Refresh Trang
- File `vercel.json` đã được tạo để fix vấn đề này
- Đảm bảo file đã được commit và push lên GitHub

### Lỗi CORS
- Kiểm tra lại Supabase → Settings → API
- Đảm bảo Vercel URL đã được thêm vào Allowed Origins

### Lỗi Environment Variables
- Vào Vercel Dashboard → Settings → Environment Variables
- Kiểm tra xem có đủ 2 biến: `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`
- Sau khi sửa, click **"Redeploy"** để build lại

## Commands Hữu Ích

```bash
# Build và test local
npm run build
npm run preview

# Check version
vercel --version

# Deploy bằng Vercel CLI (optional)
npm i -g vercel
vercel login
vercel
```

## Analytics & Monitoring

### Xem Logs
1. Vào Vercel Dashboard
2. Chọn project → Tab **"Deployments"**
3. Click vào deployment → Xem **"Build Logs"**

### Analytics (Miễn Phí)
1. Vào project → Tab **"Analytics"**
2. Xem:
   - Page views
   - Performance metrics
   - Geographic distribution
   - Device types

## Best Practices

1. **Luôn test build local trước khi push:**
   ```bash
   npm run build && npm run preview
   ```

2. **Sử dụng Preview Deployments:**
   - Tạo branch mới cho mỗi feature
   - Tạo PR để xem preview
   - Merge sau khi test xong

3. **Monitor Performance:**
   - Vercel Analytics để theo dõi tốc độ
   - Optimize images và assets nếu cần

4. **Environment Variables:**
   - KHÔNG commit file `.env` lên GitHub
   - Luôn dùng Vercel Dashboard để quản lý

## Resources

- Vercel Docs: https://vercel.com/docs
- Vite Deployment Guide: https://vitejs.dev/guide/static-deploy.html
- Supabase Docs: https://supabase.com/docs
