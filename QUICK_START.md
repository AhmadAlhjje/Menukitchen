# 🚀 دليل البدء السريع - Kitchen Frontend

## ⚡ في 5 دقائق

### 1. التثبيت
```bash
cd kitchen-frontend
npm install
```

### 2. إعداد البيئة
أنشئ ملف `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 3. التشغيل
```bash
npm run dev
```

### 4. تسجيل الدخول
افتح `http://localhost:3000/login`

```
Email: kitchen@restaurant.com
Password: admin123
```

---

## 📚 الملفات المهمة

| الملف | الغرض |
|------|-------|
| `README.md` | التوثيق الرئيسي |
| `INSTALLATION.md` | التثبيت التفصيلي |
| `FEATURES.md` | قائمة الميزات |
| `API_INTEGRATION.md` | توثيق API |
| `BACKEND_ISSUES.md` | مشاكل Backend |
| `PROJECT_SUMMARY.md` | ملخص المشروع |

---

## 🎯 المسارات الرئيسية

```
/login              → تسجيل الدخول
/dashboard          → لوحة التحكم
/orders             → الطلبات (new/ready)
/orders/:id         → تفاصيل طلب
/sessions/:id/invoice → الفاتورة
/backend-notes      → ملاحظات Backend
```

---

## 🔧 الأوامر المتاحة

```bash
npm run dev         # تشغيل Development
npm run build       # بناء Production
npm start          # تشغيل Production
npm run lint       # فحص الكود
```

---

## 🐛 حل المشاكل السريع

### المشكلة: لا يتصل بالـ Backend
```bash
# 1. تأكد من تشغيل Backend
# 2. تحقق من Base URL في .env.local
# 3. افحص Console للأخطاء
```

### المشكلة: Token Expired
```bash
# 1. سجل الخروج
# 2. سجل الدخول مرة أخرى
```

### المشكلة: الطلبات لا تظهر
```bash
# 1. افتح Console
# 2. تحقق من Network Tab
# 3. جرب زر "تحديث"
```

---

## 📖 بنية الكود

```
src/
├── app/           → Next.js Pages
├── components/    → UI Components (Atomic Design)
├── hooks/         → Custom Hooks
├── lib/           → Configs (Axios, Redux)
├── translations/  → i18n Files
├── types/         → TypeScript Types
└── utils/         → Helper Functions
```

---

## 🎨 الألوان

```typescript
Primary:    #3A86FF  // أزرق
Secondary:  #6C63FF  // بنفسجي
Accent:     #FFBE0B  // أصفر
Success:    #16A34A  // أخضر
Error:      #EF4444  // أحمر
```

---

## 🔑 المفاهيم الأساسية

### 1. Order Status
النظام يدعم حالتين فقط:
- **new**: طلب جديد
- **ready**: طلب جاهز

### 2. Authentication
- Token في `localStorage` → `kitchen_token`
- Auto-inject في Axios headers
- Auto-logout عند 401

### 3. i18n
```typescript
const { t } = useTranslation();
const text = t('common.login');
```

### 4. API Calls
```typescript
const { newOrders, markOrderAsReady } = useOrders();
```

---

## ✅ Checklist للبدء

- [ ] Backend يعمل على port 5000
- [ ] تم تثبيت المكتبات (`npm install`)
- [ ] ملف `.env.local` موجود
- [ ] تشغيل dev server (`npm run dev`)
- [ ] تسجيل دخول ناجح
- [ ] الطلبات تظهر بشكل صحيح

---

## 🆘 المساعدة السريعة

**Backend غير متاح؟**
```bash
# تحقق من Backend URL
echo $NEXT_PUBLIC_API_BASE_URL

# أو افتح المتصفح Console
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
```

**CORS Error؟**
تحقق من إعدادات CORS في Backend

**الترجمة لا تعمل؟**
```typescript
// تحقق من ملفات الترجمة
src/translations/ar.json
src/translations/en.json
```

---

## 📞 الدعم

### للمطورين
- اقرأ `API_INTEGRATION.md` للتفاصيل
- راجع `BACKEND_ISSUES.md` للمشاكل المعروفة

### لفريق Backend
- راجع `BACKEND_ISSUES.md` فوراً
- تأكد من دعم حالات `new` و `ready`

---

## 🎓 للتعلم

### Structure
```
Component → Hook → Axios → Backend API
           ↓
       Redux Store (optional)
```

### Example Flow
```typescript
// 1. في Component
const { markOrderAsReady } = useOrders();

// 2. في Hook (useOrders.ts)
const markOrderAsReady = async (id: number) => {
  await axiosInstance.patch(`/api/orders/${id}/status`, {
    status: 'ready'
  });
};

// 3. في Axios (lib/axios.ts)
// Auto adds: Authorization: Bearer <token>
```

---

## 🚀 التطوير

### إضافة صفحة جديدة
```bash
# 1. أنشئ ملف
src/app/my-page/page.tsx

# 2. استخدم Template
'use client';
import { Header } from '@/components/organisms/Header';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* المحتوى */}
      </main>
    </div>
  );
}
```

### إضافة Hook جديد
```bash
# 1. أنشئ ملف
src/hooks/useMyFeature.ts

# 2. استخدم Template
'use client';
import { useState } from 'react';

export const useMyFeature = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    // logic here
  };

  return { data, fetchData };
};
```

---

## 🎯 الهدف

**مشروع كامل وجاهز للاستخدام في 5 دقائق!**

✅ Clean Code
✅ Full Documentation
✅ Type-Safe
✅ Production Ready

**Happy Coding! 🎉**
