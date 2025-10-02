# Fix Cloudinary Upload Error

## ❌ Lỗi: "Upload failed"

**Nguyên nhân:** Upload preset chưa được tạo hoặc chưa đúng mode.

---

## ✅ Cách Fix:

### Bước 1: Vào Cloudinary Dashboard
```
https://cloudinary.com/console
```

### Bước 2: Tạo Upload Preset

1. Click ⚙️ **Settings** (góc trên bên phải)
2. Chọn tab **Upload**
3. Scroll xuống section **"Upload presets"**
4. Click **"Add upload preset"**

### Bước 3: Cấu Hình Preset

```
Upload preset name: thelabperfume_unsigned
Signing Mode: ⚠️ UNSIGNED (quan trọng!)
Folder: perfumes
```

**Advanced settings (optional):**
- Format: jpg, png, webp
- Transformation:
  - Width: 1200
  - Height: 1200
  - Crop: limit
- Quality: auto:good

### Bước 4: Save

Click **"Save"** → Preset được tạo

### Bước 5: Test Upload

1. Vào: `http://localhost:5174/admin/create-perfume`
2. Click chọn ảnh
3. Upload → Success ✅

---

## 🔄 Alternative: Dùng Preset Có Sẵn

Nếu không muốn tạo preset mới:

### Cách 1: Dùng Default Preset

Cloudinary có preset mặc định tên: **`ml_default`** hoặc check trong Upload presets list.

Update `.env`:
```bash
VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
```

### Cách 2: Lấy Preset Đang Có

1. Cloudinary Dashboard → Settings → Upload
2. Xem list "Upload presets"
3. Copy tên preset có **Signing Mode = Unsigned**
4. Update `.env`

---

## 🧪 Debug Upload Error

Nếu vẫn lỗi, check console log:

### Mở Browser DevTools:
```
F12 → Console tab
```

### Upload ảnh và xem error:

**Error: "Upload preset not configured"**
→ `.env` không có `VITE_CLOUDINARY_UPLOAD_PRESET`

**Error: "Upload failed" + 400 Bad Request**
→ Upload preset không tồn tại hoặc sai tên

**Error: "Upload failed" + 401 Unauthorized**
→ Preset là Signed mode (cần đổi sang Unsigned)

**Error: "CORS policy blocked"**
→ Không phải lỗi Cloudinary (hiếm gặp)

---

## 📝 Checklist

- [ ] Cloudinary account đã đăng ký
- [ ] Upload preset đã tạo
- [ ] Preset mode = **Unsigned**
- [ ] Preset name khớp với `.env`
- [ ] Cloud name đúng trong `.env`
- [ ] Dev server đã restart: `npm run dev`

---

## 🔑 Verify .env

File `.env` phải có:
```bash
VITE_CLOUDINARY_CLOUD_NAME=dt7b6ovud
VITE_CLOUDINARY_UPLOAD_PRESET=thelabperfume_unsigned
```

**Restart dev server sau khi sửa .env!**

---

## ✅ Khi Upload Thành Công

Console sẽ hiển thị:
```javascript
{
  publicId: "perfumes/abc123",
  url: "https://res.cloudinary.com/dt7b6ovud/image/upload/v1234/perfumes/abc123.jpg",
  width: 1200,
  height: 1200,
  format: "jpg"
}
```

Form sẽ hiển thị:
```
✓ Image uploaded successfully
```
