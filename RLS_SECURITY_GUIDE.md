# Row Level Security (RLS) - Best Practices

## ⚠️ Rủi Ro Khi Tắt RLS

### **Tắt RLS = Nguy Hiểm:**

```sql
ALTER TABLE perfumes DISABLE ROW LEVEL SECURITY;
```

**Rủi ro:**
- ❌ **Bất kỳ ai** cũng có thể thêm/sửa/xóa perfumes
- ❌ Users có thể spam data
- ❌ Users có thể xóa toàn bộ database
- ❌ Không có access control
- ❌ Không phân biệt admin vs user

**Ví dụ tấn công:**
```javascript
// Bất kỳ ai cũng có thể chạy:
await supabase.from('perfumes').delete()  // XÓA TẤT CẢ!
await supabase.from('perfumes').insert({ spam: 'data' })  // SPAM!
```

---

## ✅ Best Practice: RLS Theo Vai Trò

### **Development (Local):**
```sql
-- Tắt RLS OK cho dev nhanh
ALTER TABLE perfumes DISABLE ROW LEVEL SECURITY;
```
✅ Chỉ dùng local, không ai truy cập được

---

### **Production (Vercel):**

#### **Strategy 1: Admin-Only Write, Public Read**

```sql
-- Enable RLS
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

-- 1. Public có thể READ (browse, xem perfumes)
CREATE POLICY "Public can view perfumes"
ON perfumes
FOR SELECT
TO anon, authenticated
USING (true);

-- 2. CHỈ Admin có thể INSERT/UPDATE/DELETE
CREATE POLICY "Only admin can modify"
ON perfumes
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (
    'admin@thelabperfume.com',
    'your-email@gmail.com'
  )
);
```

**Cách hoạt động:**
- ✅ Users browse perfumes (public read)
- ✅ Chỉ admin emails mới create/edit/delete
- ✅ An toàn, không ai spam được

---

#### **Strategy 2: Service Role Key (Backend Only)**

```sql
-- Enable RLS
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

-- Public READ only
CREATE POLICY "Public read"
ON perfumes FOR SELECT
TO anon USING (true);

-- NO public write
-- Frontend KHÔNG thể insert
```

**Frontend:** Chỉ READ
```javascript
// Frontend - READ OK
const { data } = await supabase.from('perfumes').select('*')
```

**Backend API:** Dùng Service Role Key để WRITE
```javascript
// Backend API Route (Vercel Serverless Function)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY  // ← SECRET, chỉ backend có
)

// Backend có thể insert
await supabase.from('perfumes').insert(...)
```

**Pros:**
- ✅ An toàn nhất
- ✅ Frontend không thể abuse
- ❌ Phức tạp hơn (cần backend API)

---

#### **Strategy 3: Authenticated Users Write**

```sql
-- Enable RLS
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

-- Public READ
CREATE POLICY "Public read"
ON perfumes FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated users INSERT (với limit)
CREATE POLICY "Authenticated can create"
ON perfumes FOR INSERT
TO authenticated
WITH CHECK (
  -- Only own perfumes
  auth.uid() = user_id
);

-- Users chỉ sửa/xóa perfumes của mình
CREATE POLICY "Users manage own perfumes"
ON perfumes
FOR UPDATE, DELETE
TO authenticated
USING (auth.uid() = user_id);
```

**Cần thêm column:**
```sql
ALTER TABLE perfumes ADD COLUMN user_id UUID REFERENCES auth.users(id);
```

**Pros:**
- ✅ Users có thể contribute perfumes
- ✅ Users chỉ edit perfumes của mình
- ❌ Cần authentication system

---

## 🎯 Khuyến Nghị Cho Project Của Bạn

### **Phase 1: Development (Hiện tại)**
```sql
-- Local: Tắt RLS
ALTER TABLE perfumes DISABLE ROW LEVEL SECURITY;
```
✅ OK cho dev nhanh

---

### **Phase 2: Production MVP (Sắp deploy)**

**Tạm thời cho phép public insert** (để test):
```sql
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Temporary public access"
ON perfumes FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
```

⚠️ Tạm thời OK, nhưng cần fix sau

---

### **Phase 3: Production Secure (Lâu dài)**

**Option A: Admin Email Whitelist** (Đơn giản nhất)

```sql
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can view"
ON perfumes FOR SELECT
TO anon, authenticated
USING (true);

-- Admin write
CREATE POLICY "Admin can modify"
ON perfumes FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'your-admin-email@gmail.com'
);
```

**Setup admin:**
1. Supabase → Authentication → Users
2. Invite yourself (admin email)
3. Login vào app
4. Giờ chỉ bạn mới create perfumes được ✅

---

**Option B: Backend API** (An toàn nhất)

```
Frontend (Read Only)
     ↓
Backend API (Vercel Serverless)
     ↓
Supabase (Service Role Key)
```

1. Frontend: READ perfumes
2. Admin form → Call backend API
3. Backend verify admin → Insert to Supabase

---

## 📝 Implementation Steps

### **Ngay Bây Giờ (Quick Fix):**

1. **Local (Dev):**
   ```sql
   ALTER TABLE perfumes DISABLE ROW LEVEL SECURITY;
   ```

2. **Vercel (Prod):**
   ```sql
   ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

   -- Temporary public access (FIX LATER!)
   CREATE POLICY "temp_public_access"
   ON perfumes FOR ALL
   TO anon, authenticated
   USING (true) WITH CHECK (true);
   ```

---

### **Sau Này (Production Secure):**

**Setup Supabase Auth:**

1. **Tạo admin account:**
   - Supabase → Auth → Users → Invite user
   - Email: your-admin@gmail.com

2. **Update RLS:**
   ```sql
   DROP POLICY "temp_public_access" ON perfumes;

   CREATE POLICY "public_read"
   ON perfumes FOR SELECT
   TO anon, authenticated
   USING (true);

   CREATE POLICY "admin_write"
   ON perfumes FOR ALL
   TO authenticated
   USING (auth.jwt() ->> 'email' = 'your-admin@gmail.com');
   ```

3. **Update frontend:**
   ```javascript
   // Admin login trước khi create perfume
   const { data } = await supabase.auth.signInWithPassword({
     email: 'admin@gmail.com',
     password: 'xxx'
   })

   // Giờ create perfume OK
   await supabase.from('perfumes').insert(...)
   ```

---

## 🔒 Security Checklist

### Development:
- [x] RLS disabled local (OK)
- [ ] Never commit .env with production keys

### Staging/Testing:
- [ ] RLS enabled
- [ ] Temporary public access (với warning)
- [ ] Monitor for abuse

### Production:
- [ ] RLS enabled
- [ ] Admin-only write policies
- [ ] Public read-only
- [ ] Authentication required for writes
- [ ] Rate limiting (Supabase auto)
- [ ] Monitor logs

---

## 🚨 Red Flags (Cần fix ngay)

**BAD:**
```sql
-- Production với RLS tắt = NGUY HIỂM!
ALTER TABLE perfumes DISABLE ROW LEVEL SECURITY;
```

**BAD:**
```sql
-- Production cho phép anon insert mãi mãi
CREATE POLICY "public_all" ON perfumes
FOR ALL TO anon USING (true);
```

**GOOD:**
```sql
-- Public read, admin write
CREATE POLICY "public_read" ON perfumes
FOR SELECT TO anon USING (true);

CREATE POLICY "admin_write" ON perfumes
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');
```

---

## 💡 Tóm Tắt

| Environment | RLS Status | Who Can Write? | Risk Level |
|-------------|-----------|----------------|------------|
| **Local Dev** | ❌ Disabled | Anyone (chỉ localhost) | ✅ Low |
| **Prod (hiện tại)** | ✅ Enabled + Public Write | Anyone on internet | 🔴 HIGH |
| **Prod (cần fix)** | ✅ Enabled + Admin Only | Chỉ admin emails | ✅ Low |
| **Prod (best)** | ✅ Enabled + Backend API | Backend with Service Key | ✅ Lowest |

---

**Next Steps:**
1. ✅ Hiện tại: RLS disabled local (OK)
2. ⚠️ Prod: Enable RLS + temporary public (fix sau)
3. 🔒 Sau: Setup admin auth + admin-only policies
