# Tạo Cloudinary Upload Preset Đúng Cách

## ❌ Lỗi Hiện Tại:
```
Invalid extension in transformation: jpg, png, webp
```

**Nguyên nhân:** Preset có transformation format sai syntax.

---

## ✅ Cách Tạo Preset Đúng:

### Bước 1: Vào Cloudinary Settings
```
https://console.cloudinary.com/settings/upload
```

### Bước 2: Add Upload Preset

Click **"Add upload preset"**

### Bước 3: Cấu Hình Cơ Bản

```
Upload preset name: ml_default
Signing Mode: Unsigned ← QUAN TRỌNG!
Folder: perfumes
```

### Bước 4: KHÔNG Thêm Transformation

**⚠️ Để trống các phần:**
- ❌ Incoming Transformation
- ❌ Eager transformations
- ❌ Format (để auto)

Cloudinary sẽ tự động:
- Detect format (jpg, png, webp)
- Optimize khi cần

### Bước 5: Save

Click **"Save"** → Done!

---

## 🔄 Alternative: Sửa Preset Hiện Tại

### 1. Edit preset `thelabperfume_unsigned`

### 2. Tìm transformation có lỗi:
```
f_jpg,png,webp  ← SAI
```

### 3. Sửa thành:
```
f_auto  ← ĐÚNG (auto-detect format)
```

Hoặc **XÓA** hẳn transformation đó.

### 4. Save

---

## 📝 Preset Settings Đúng:

```yaml
Upload preset name: ml_default
Signing mode: Unsigned
Folder: perfumes

# Transformations: ← ĐỂ TRỐNG hoặc đơn giản:
Width: 1200
Height: 1200
Crop: limit
Quality: auto
Format: auto  # KHÔNG dùng jpg,png,webp
```

---

## 🧪 Test Preset

### Cách 1: Test trực tiếp
```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/dt7b6ovud/image/upload \
  -F "file=@test.jpg" \
  -F "upload_preset=ml_default"
```

### Cách 2: Test qua app
1. Update `.env`:
   ```
   VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
   ```
2. Restart: `npm run dev`
3. Upload ảnh → Success ✅

---

## ✅ Khi Upload Thành Công

Console sẽ hiển thị:
```javascript
{
  publicId: "perfumes/abc123",
  url: "https://res.cloudinary.com/dt7b6ovud/...",
  width: 1200,
  height: 1200,
  format: "jpg"
}
```

Không còn lỗi transformation!
