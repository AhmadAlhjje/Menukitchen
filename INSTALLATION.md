# تعليمات التثبيت والتشغيل - Kitchen Frontend

## متطلبات التشغيل

- Node.js 18.x أو أحدث
- npm أو yarn
- Backend API يعمل على المنفذ 5000

## خطوات التثبيت

### 1. تثبيت المكتبات

```bash
npm install
```

### 2. إعداد ملف البيئة

أنشئ ملف `.env.local` في المجلد الرئيسي:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

إذا كان Backend يعمل على منفذ مختلف، قم بتغيير الرابط أعلاه.

### 3. التشغيل في وضع التطوير

```bash
npm run dev
```

سيعمل التطبيق على: `http://localhost:3000`

### 4. البناء للإنتاج

```bash
npm run build
npm start
```

## بيانات تسجيل الدخول

استخدم أحد الحسابات التالية:

- **Kitchen Account:**
  - Email: `kitchen@restaurant.com`
  - Password: `admin123`

- **Admin Account:**
  - Email: `admin@restaurant.com`
  - Password: `admin123`

## الصفحات المتاحة

1. **تسجيل الدخول**: `/login`
2. **لوحة التحكم**: `/dashboard`
3. **الطلبات**: `/orders`
4. **تفاصيل طلب**: `/orders/[id]`
5. **الفاتورة**: `/sessions/[id]/invoice`
6. **ملاحظات Backend**: `/backend-notes`

## حالات الطلبات

النظام يدعم حالتين فقط:

- **new**: طلب جديد من العميل
- **ready**: طلب جاهز للتقديم

أي حالة أخرى من الـ API سيتم تجاهلها.

## الميزات

✅ تسجيل دخول آمن مع JWT
✅ لوحة تحكم بإحصائيات فورية
✅ إدارة الطلبات (جديد / جاهز)
✅ تفاصيل كاملة لكل طلب
✅ فواتير قابلة للطباعة
✅ دعم كامل للعربية والإنجليزية
✅ دعم RTL
✅ إدارة ملاحظات لفريق Backend
✅ تحديث تلقائي كل 30 ثانية

## حل المشاكل الشائعة

### 1. خطأ في الاتصال بالـ Backend

تأكد من:
- Backend يعمل على `http://localhost:5000`
- لا يوجد CORS errors في console
- ملف `.env.local` يحتوي على الرابط الصحيح

### 2. Token expired

- قم بتسجيل الخروج والدخول مرة أخرى
- تحقق من صلاحية التوكن في Backend

### 3. الطلبات لا تظهر

- تحقق من أن Backend يرجع الحالات `new` و `ready`
- افتح Console وتحقق من الأخطاء
- جرب زر "تحديث" في الصفحة

## الهيكل التنظيمي

```
src/
├── app/                    # Next.js Pages
├── components/             # React Components
│   ├── atoms/             # مكونات أساسية
│   ├── molecules/         # مكونات متوسطة
│   └── organisms/         # مكونات معقدة
├── hooks/                 # Custom Hooks
├── lib/                   # Configurations
│   ├── axios.ts          # Axios setup
│   └── redux/            # Redux store
├── translations/          # i18n files
├── types/                # TypeScript types
└── utils/                # Helper functions
```

## المساعدة

إذا واجهت أي مشاكل، تحقق من:

1. Console في المتصفح
2. Network tab في DevTools
3. Terminal logs

أو راجع ملف `README.md` للمزيد من المعلومات.
