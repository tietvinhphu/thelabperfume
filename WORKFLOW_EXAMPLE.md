# Workflow: Tạo Sản Phẩm Nước Hoa Mới

## 📊 Diagram Tổng Quan

```
┌─────────────┐
│   USER      │  1. Truy cập /admin/create-perfume
│  (Admin)    │  2. Điền form + upload ảnh
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────┐
│         FRONTEND (Vercel)                │
│  ┌────────────────────────────────┐      │
│  │   CreatePerfume Component      │      │
│  │   - Form inputs                │      │
│  │   - ImageUpload component      │      │
│  └────────────┬───────────────────┘      │
└───────────────┼──────────────────────────┘
                │
                ▼ 3. Upload image
        ┌───────────────┐
        │  CLOUDINARY   │
        │   (Storage)   │
        └───────┬───────┘
                │
                ▼ 4. Return URL
┌───────────────────────────────────────────┐
│         FRONTEND (Vercel)                 │
│  - Nhận Cloudinary URL                    │
│  - Combine với form data                  │
└───────────────┬───────────────────────────┘
                │
                ▼ 5. Save to database
        ┌───────────────┐
        │   SUPABASE    │
        │  (Database)   │
        └───────┬───────┘
                │
                ▼ 6. Return success
┌───────────────────────────────────────────┐
│         FRONTEND (Vercel)                 │
│  - Show success message                   │
│  - Redirect to /browse                    │
└───────────────────────────────────────────┘
                │
                ▼ 7. Display perfume
        ┌───────────────┐
        │  Browse Page  │
        │  ┌─────────┐  │
        │  │ Perfume │  │ ← Image từ Cloudinary
        │  │  Card   │  │ ← Data từ Supabase
        │  └─────────┘  │
        └───────────────┘
```

---

## 🔄 Chi Tiết Từng Bước

### **1. User Truy Cập Form**
```
URL: http://localhost:5173/admin/create-perfume
Component: CreatePerfume.jsx
```

### **2. User Điền Thông Tin**
```jsx
Form Data:
{
  name: "Dior Sauvage",
  brand: "Dior",
  year: 2015,
  family: "Aromatic Fougère",
  description: "A fresh and spicy fragrance..."
}
```

### **3. User Upload Ảnh**
```jsx
<ImageUpload
  folder="perfumes"
  onUploadSuccess={handleImageUpload}
/>
```

**Cloudinary Process:**
```
File: sauvage.jpg (5MB)
↓
Cloudinary Upload:
- Resize: 1200x1200
- Compress: 80% quality
- Format: Auto (WebP for Chrome)
↓
Result: sauvage.webp (500KB) ✅
```

**Response từ Cloudinary:**
```json
{
  "publicId": "perfumes/sauvage_abc123",
  "url": "https://res.cloudinary.com/demo/image/upload/v1234/perfumes/sauvage_abc123.webp",
  "width": 1200,
  "height": 1200,
  "format": "webp"
}
```

### **4. Frontend Nhận URL**
```javascript
const handleImageUpload = (result) => {
  setFormData({
    ...formData,
    image_url: result.url,                    // ← Cloudinary URL
    cloudinary_public_id: result.publicId     // ← Để edit/delete sau này
  })
}
```

**State sau khi upload:**
```javascript
formData = {
  name: "Dior Sauvage",
  brand: "Dior",
  year: 2015,
  family: "Aromatic Fougère",
  description: "A fresh and spicy fragrance...",
  image_url: "https://res.cloudinary.com/.../sauvage.webp",  // ← NEW
  cloudinary_public_id: "perfumes/sauvage_abc123"           // ← NEW
}
```

### **5. Submit Form → Save to Supabase**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()

  // Insert to Supabase
  const { data, error } = await supabase
    .from('perfumes')
    .insert({
      name: formData.name,
      brand: formData.brand,
      year: formData.year,
      family: formData.family,
      description: formData.description,
      image_url: formData.image_url,              // ← Cloudinary URL
      cloudinary_public_id: formData.cloudinary_public_id
    })
    .select()
    .single()

  if (error) throw error

  // Success!
  console.log('Created:', data)
}
```

**Supabase Database:**
```sql
INSERT INTO perfumes (
  id,
  name,
  brand,
  year,
  family,
  description,
  image_url,
  cloudinary_public_id,
  created_at
) VALUES (
  uuid_generate_v4(),
  'Dior Sauvage',
  'Dior',
  2015,
  'Aromatic Fougère',
  'A fresh and spicy fragrance...',
  'https://res.cloudinary.com/.../sauvage.webp',  -- ← Cloudinary URL
  'perfumes/sauvage_abc123',                       -- ← Public ID
  NOW()
);
```

### **6. Hiển Thị Trên Browse Page**
```javascript
// Browse.jsx
const { data: perfumes } = await supabase
  .from('perfumes')
  .select('*')

// Render
perfumes.map(perfume => (
  <PerfumeCard
    key={perfume.id}
    name={perfume.name}
    brand={perfume.brand}
    image={perfume.image_url}  // ← Cloudinary URL
  />
))
```

**HTML Output:**
```html
<img
  src="https://res.cloudinary.com/demo/image/upload/v1234/perfumes/sauvage.webp"
  alt="Dior Sauvage"
  loading="lazy"
/>
```

---

## 🎯 Tại Sao Dùng 3 Services?

### **Cloudinary (Storage + Optimization)**
- ✅ Lưu trữ ảnh
- ✅ Tự động optimize (resize, compress, format)
- ✅ CDN toàn cầu (load nhanh)
- ✅ Không tốn bandwidth của Vercel
- ❌ **KHÔNG** lưu metadata (name, brand, etc.)

### **Supabase (Database)**
- ✅ Lưu metadata (name, brand, year, description)
- ✅ Relationships (perfumes ↔ ingredients)
- ✅ Queries phức tạp (search, filter)
- ✅ Authentication & permissions
- ❌ **KHÔNG** lưu files lớn (images, videos)

### **Vercel (Hosting)**
- ✅ Host frontend React app
- ✅ Serve HTML/CSS/JS
- ✅ CDN cho static assets
- ✅ Tích hợp CI/CD với GitHub
- ❌ **KHÔNG** làm backend hoặc database

---

## 📈 Performance Benefits

### **Không dùng Cloudinary:**
```
User → Vercel (download 5MB image) → Browser
- Slow: 5-10s
- Tốn bandwidth Vercel
```

### **Có Cloudinary:**
```
User → Cloudinary CDN (500KB optimized) → Browser
- Fast: 0.5-1s
- Auto WebP format
- Cached globally
- Vercel không tốn bandwidth
```

---

## 🔐 Security Flow

### **Frontend → Cloudinary (Unsigned Upload)**
```javascript
// Public upload (không cần API Secret)
uploadPreset: 'thelabperfume_unsigned'  // ← Set trong Cloudinary Dashboard
```

**Safe vì:**
- ✅ Chỉ cho phép upload ảnh
- ✅ Max size limit (5MB)
- ✅ Chỉ vào folder 'perfumes'
- ✅ Auto moderation (AI detect inappropriate)

### **Frontend → Supabase (Row Level Security)**
```sql
-- Chỉ admin mới insert được
CREATE POLICY "Only admins can insert"
ON perfumes FOR INSERT
USING (auth.role() = 'admin');
```

---

## 🧪 Test Workflow

### **1. Setup Credentials:**
```bash
# .env
VITE_CLOUDINARY_CLOUD_NAME=demo
VITE_CLOUDINARY_UPLOAD_PRESET=thelabperfume_unsigned
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### **2. Run Dev Server:**
```bash
npm run dev
```

### **3. Truy Cập Form:**
```
http://localhost:5173/admin/create-perfume
```

### **4. Upload & Submit:**
1. Upload ảnh → Thấy preview
2. Điền form → Submit
3. Check console → Thấy Cloudinary URL
4. Check Supabase → Thấy record mới
5. Vào /browse → Thấy perfume mới

---

## 🔄 Update/Delete Flow

### **Update Perfume:**
```javascript
// 1. User upload ảnh mới → Cloudinary
const newImage = await uploadImage(file, 'perfumes')

// 2. Update Supabase
await supabase
  .from('perfumes')
  .update({
    image_url: newImage.url,
    cloudinary_public_id: newImage.publicId
  })
  .eq('id', perfumeId)

// Note: Ảnh cũ vẫn ở Cloudinary (cần backend API để xóa)
```

### **Delete Perfume:**
```javascript
// 1. Delete từ Supabase
await supabase
  .from('perfumes')
  .delete()
  .eq('id', perfumeId)

// 2. Delete ảnh từ Cloudinary (cần backend)
// Frontend KHÔNG thể delete (cần API Secret)
// → Làm sau với Serverless Function
```

---

## 🚀 Production Workflow

### **Vercel:**
```
Git push → Vercel auto deploy → Live website
```

### **Cloudinary:**
```
Same credentials cho dev & prod
(hoặc tạo 2 accounts riêng)
```

### **Supabase:**
```
Dev: thelabperfume-dev
Prod: thelabperfume-prod
```

---

## 📝 Summary

| Service | Role | Data Stored |
|---------|------|-------------|
| **Cloudinary** | Image storage & CDN | Files (jpg, png, webp) |
| **Supabase** | Database | Metadata (name, brand, URLs) |
| **Vercel** | Frontend hosting | React code (HTML/CSS/JS) |

**Workflow:**
1. User upload → Cloudinary
2. Cloudinary return URL → Frontend
3. Frontend + URL → Supabase
4. Supabase save → Database
5. Browse page fetch → Supabase
6. Display image → Cloudinary CDN

**Kết quả:** Webapp nhanh, scalable, dễ maintain! 🎉
