# تعليمات رفع المشروع على السيرفر باستخدام Docker

## المتطلبات
- Docker
- Docker Compose

## خطوات التشغيل

### 1. رفع الملفات إلى السيرفر
قم برفع جميع ملفات المشروع إلى السيرفر

### 2. بناء وتشغيل الـ Container

```bash
# بناء الصورة وتشغيل الـ container
docker-compose up -d --build
```

### 3. التحقق من التشغيل

```bash
# عرض الـ containers العاملة
docker-compose ps

# عرض logs
docker-compose logs -f
```

### 4. الوصول للتطبيق
التطبيق سيعمل على: `http://SERVER_IP:4001`

## أوامر مفيدة

```bash
# إيقاف الـ container
docker-compose down

# إعادة تشغيل
docker-compose restart

# إعادة البناء بعد تغيير الكود
docker-compose up -d --build

# عرض logs لحاوية معينة
docker-compose logs -f menukitchen-frontend

# الدخول إلى الـ container
docker-compose exec menukitchen-frontend sh
```

## الإعدادات
- **البورت**: 4001
- **Backend API**: http://217.76.53.136:3000

## ملاحظات
- تأكد من أن البورت 4001 غير مستخدم على السيرفر
- تأكد من أن الـ Backend API على العنوان http://217.76.53.136:3000 يعمل بشكل صحيح
- في حالة تغيير عنوان الـ Backend، قم بتحديث متغير البيئة `NEXT_PUBLIC_API_BASE_URL` في ملف docker-compose.yml
