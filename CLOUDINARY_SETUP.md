# Hướng Dẫn Setup Cloudinary

## ✅ Đã Cài Đặt

- [x] Cloudinary packages
- [x] Cloudinary service utilities
- [x] ImageUpload component

---

## 📝 Bước 1: Lấy Cloudinary Credentials

### 1.1. Đăng nhập Cloudinary
1. Truy cập: https://cloudinary.com/console
2. Đăng nhập hoặc đăng ký miễn phí

### 1.2. Copy credentials từ Dashboard
Trong Dashboard, bạn sẽ thấy:

```
Cloud name: dxxxxx
API Key: 123456789012345
API Secret: ************************
```

**Chỉ cần copy `Cloud name`** (API Key & Secret dùng cho backend)

---

## 🔧 Bước 2: Tạo Upload Preset

### 2.1. Vào Settings
1. Cloudinary Dashboard → Click **Settings** (góc trên bên phải)
2. Chọn tab **Upload**

### 2.2. Scroll xuống "Upload presets"
1. Click **Add upload preset**
2. Điền thông tin:
   - **Preset name**: `thelabperfume_unsigned`
   - **Signing Mode**: **Unsigned** (quan trọng!)
   - **Folder**: `perfumes` (optional)
   - **Format**: `jpg, png, webp`
   - **Transformation**:
     - Width: `1200`
     - Height: `1200`
     - Crop: `limit`
   - **Quality**: `auto:good`

3. Click **Save**

### 2.3. Copy Upload Preset Name
- Sẽ hiển thị: `thelabperfume_unsigned`
- Copy tên này

---

## 🔑 Bước 3: Cấu Hình Environment Variables

### 3.1. Local Development (.env)

Thêm vào file `.env`:

```bash
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dxxxxx
VITE_CLOUDINARY_UPLOAD_PRESET=thelabperfume_unsigned
```

Thay `dxxxxx` và `thelabperfume_unsigned` bằng giá trị thực của bạn.

### 3.2. Vercel Production

1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Thêm 2 biến:

```
VITE_CLOUDINARY_CLOUD_NAME = dxxxxx
VITE_CLOUDINARY_UPLOAD_PRESET = thelabperfume_unsigned
```

3. Chọn Environment: **Production, Preview, Development**
4. Click **Save**
5. **Redeploy** để áp dụng

---

## 🧪 Bước 4: Test Upload Component

### 4.1. Import component
```jsx
import ImageUpload from './components/ui/ImageUpload'
```

### 4.2. Sử dụng trong page
```jsx
function MyPage() {
  const handleUploadSuccess = (result) => {
    console.log('Upload success:', result)
    // result.url = https://res.cloudinary.com/.../image.jpg
    // result.publicId = perfumes/abc123
  }

  const handleUploadError = (error) => {
    console.error('Upload error:', error)
  }

  return (
    <ImageUpload
      folder="perfumes"
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
    />
  )
}
```

### 4.3. Test local
```bash
npm run dev
```

Upload một ảnh và check console để thấy result

---

## 📦 Bước 5: Cập Nhật Database Schema

### 5.1. Thêm cột image_url vào tables (nếu chưa có)

```sql
-- Perfumes table
ALTER TABLE perfumes
ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_url TEXT;

-- Ingredients table
ALTER TABLE ingredients
ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_url TEXT;
```

### 5.2. Update service để lưu Cloudinary URLs

Trong [src/services/supabase.js](src/services/supabase.js), update functions:

```javascript
async createPerfume(perfumeData) {
  const { data, error } = await supabase
    .from('perfumes')
    .insert({
      ...perfumeData,
      cloudinary_url: perfumeData.imageUrl,  // từ ImageUpload
      cloudinary_public_id: perfumeData.publicId
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

---

## 🎨 Bước 6: Sử Dụng Optimized Images

### 6.1. Hiển thị ảnh đã optimize
```jsx
import { getOptimizedImageUrl, getThumbnailUrl } from '../services/cloudinary'

function PerfumeCard({ perfume }) {
  // Responsive images
  const thumbnailUrl = getThumbnailUrl(perfume.cloudinary_public_id)
  const fullUrl = getOptimizedImageUrl(perfume.cloudinary_public_id, {
    width: 800,
    quality: 'auto:good'
  })

  return (
    <div>
      <img
        src={thumbnailUrl}
        alt={perfume.name}
        loading="lazy"
      />
    </div>
  )
}
```

### 6.2. Lazy loading với placeholder
```jsx
import { useState } from 'react'

function LazyImage({ publicId, alt }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <div className="skeleton" />}
      <img
        src={getOptimizedImageUrl(publicId)}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </>
  )
}
```

---

## 🔒 Bước 7: Security Best Practices

### 7.1. Upload Preset Settings (Đã làm ở Bước 2)
- ✅ Unsigned mode - cho phép upload từ frontend
- ✅ Folder restriction - chỉ upload vào folder cụ thể
- ✅ Format restriction - chỉ accept image types
- ✅ Size limit - max 5MB (set trong component)

### 7.2. Cloudinary Security Settings
1. Dashboard → Settings → Security
2. Enable:
   - **Allowed formats**: jpg, png, webp
   - **Max file size**: 10MB
   - **Rate limiting**: ON

### 7.3. KHÔNG expose API Secret
- ❌ NEVER add API Secret vào .env
- ✅ API Secret chỉ dùng cho backend
- ✅ Frontend chỉ dùng Cloud Name + Upload Preset

---

## 📊 Bước 8: Monitor Usage

### 8.1. Check Cloudinary Dashboard
- **Media Library** → Xem tất cả ảnh đã upload
- **Reports** → Usage statistics
- **Transformations** → Optimization metrics

### 8.2. Free Tier Limits
- Storage: 25GB
- Bandwidth: 25GB/month
- Transformations: 25 credits/month

Đủ cho project nhỏ/vừa!

---

## 🐛 Troubleshooting

### Error: "Upload preset not found"
- Check VITE_CLOUDINARY_UPLOAD_PRESET đúng tên chưa
- Verify preset là **Unsigned** mode

### Error: "Invalid cloud name"
- Check VITE_CLOUDINARY_CLOUD_NAME
- Không có space, chỉ là tên (vd: `dxxxxx`)

### Image không hiển thị
- Check publicId có đúng format không
- Try direct URL: `https://res.cloudinary.com/{cloud_name}/image/upload/{publicId}`

### Upload chậm
- Check file size (nên < 2MB)
- Enable Cloudinary auto-optimization
- Sử dụng WebP format

---

## 🚀 Next Steps

1. **Tích hợp vào Admin Dashboard** - Cho phép admin upload perfume images
2. **Bulk upload** - Upload nhiều ảnh cùng lúc
3. **Image gallery** - Multiple images per perfume
4. **Video support** - Nếu cần perfume videos

---

## 📚 Resources

- Cloudinary Docs: https://cloudinary.com/documentation
- React SDK: https://cloudinary.com/documentation/react_integration
- Upload Widget: https://cloudinary.com/documentation/upload_widget
- Optimization Guide: https://cloudinary.com/documentation/image_optimization
