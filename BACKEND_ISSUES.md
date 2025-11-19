# قائمة المشاكل والملاحظات المحتملة في Backend API

## 🚨 ملاحظات هامة

هذا الملف يحتوي على قائمة بالمشاكل المحتملة التي قد تواجه فريق Frontend عند التكامل مع Backend. هذه القائمة مبنية على تحليل ملف Postman Collection.

---

## 1. حالات الطلبات (Order Status)

### المشكلة
ملف Postman يُظهر حالات متعددة للطلبات:
- `new`
- `preparing`
- `delivered`
- `pending` (محتمل)
- `served` (محتمل)

بينما Frontend يحتاج فقط:
- `new`: طلب جديد
- `ready`: طلب جاهز

### الحل المطلوب
**نوع**: Enhancement
**الأهمية**: High
**Endpoint**: `PATCH /api/orders/:id/status`

**ما المطلوب:**
1. دعم حالة `ready` بشكل رسمي
2. توحيد الحالات المستخدمة
3. توثيق واضح لكل حالة ومعناها

---

## 2. Kitchen Dashboard Endpoint

### المشكلة
في Postman Collection، Endpoint الـ Dashboard:
```
GET /api/kitchen/dashboard
```

لكن غير واضح إذا كان يُرجع:
- `newOrdersCount` أم `pendingOrders`
- `readyOrdersCount` أم `preparingOrders`

### الحل المطلوب
**نوع**: Missing Documentation
**الأهمية**: Medium
**Endpoint**: `GET /api/kitchen/dashboard`

**ما المطلوب:**
Response واضح مثل:
```json
{
  "success": true,
  "data": {
    "newOrdersCount": 5,
    "readyOrdersCount": 3,
    "activeSessionsCount": 10,
    "todayOrdersCount": 25
  }
}
```

---

## 3. Response Structure غير متناسق

### المشكلة
بعض Endpoints تُرجع:
```json
{
  "orders": [...]
}
```

وبعضها:
```json
{
  "data": [...]
}
```

وبعضها:
```json
[...]
```

### الحل المطلوب
**نوع**: Enhancement
**الأهمية**: Medium
**Endpoints**: جميع Endpoints

**ما المطلوب:**
توحيد الـ Response structure:
```json
{
  "success": true,
  "message": "...",
  "data": {
    // البيانات هنا
  }
}
```

---

## 4. Order Items Details

### المشكلة
عند جلب Order بـ ID، غير واضح إذا كان يُرجع:
- تفاصيل الـ MenuItem مع كل OrderItem
- أم فقط `itemId` ويجب جلب التفاصيل بشكل منفصل

### الحل المطلوب
**نوع**: Enhancement
**الأهمية**: High
**Endpoint**: `GET /api/orders/:id`

**ما المطلوب:**
Response يتضمن تفاصيل الأصناف:
```json
{
  "order": {
    "id": 1,
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "price": 50,
        "notes": "بدون بصل",
        "item": {
          "id": 3,
          "name": "Grilled Chicken",
          "nameAr": "دجاج مشوي",
          "image": "...",
          "preparationTime": 30
        }
      }
    ]
  }
}
```

---

## 5. Session Information في Orders

### المشكلة
عند جلب Order، غير واضح إذا كان يُرجع:
- معلومات الـ Session
- معلومات الـ Table
- أم فقط `sessionId`

### الحل المطلوب
**نوع**: Enhancement
**الأهمية**: Medium
**Endpoint**: `GET /api/orders/:id`

**ما المطلوب:**
Include Session & Table details:
```json
{
  "order": {
    "id": 1,
    "sessionId": 5,
    "session": {
      "id": 5,
      "tableId": 2,
      "numberOfGuests": 4,
      "table": {
        "id": 2,
        "tableNumber": "T2",
        "location": "الطابق الأول"
      }
    }
  }
}
```

---

## 6. CORS Configuration

### المشكلة المحتملة
قد يحدث CORS errors عند الاتصال من `http://localhost:3000`

### الحل المطلوب
**نوع**: Configuration
**الأهمية**: High

**ما المطلوب:**
تفعيل CORS في Backend:
```javascript
// Express example
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

---

## 7. Token Expiration Time

### المشكلة
غير موثّق مدة صلاحية الـ JWT Token

### الحل المطلوب
**نوع**: Documentation
**الأهمية**: Low

**ما المطلوب:**
- توثيق مدة صلاحية Token
- Refresh token mechanism (اختياري)

---

## 8. Error Messages بالعربي

### المشكلة
رسائل الأخطاء قد تأتي بالإنجليزية فقط

### الحل المطلوب
**نوع**: Enhancement
**الأهمية**: Low

**ما المطلوب:**
Error messages تدعم اللغتين:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "messageAr": "بيانات الدخول غير صحيحة"
}
```

---

## 9. Kitchen/Admin Permissions

### المشكلة
بعض Endpoints غير واضح إذا كان Kitchen role يستطيع الوصول لها

### الحل المطلوب
**نوع**: Documentation
**الأهمية**: Medium

**ما المطلوب:**
توثيق واضح لكل Endpoint:
- Roles المسموح لها
- Permissions المطلوبة

---

## 10. Rate Limiting

### المشكلة المحتملة
Frontend يُحدّث البيانات كل 30 ثانية، قد يسبب Rate Limiting

### الحل المطلوب
**نوع**: Configuration
**الأهمية**: Low

**ما المطلوب:**
- تأكيد عدم وجود Rate Limiting صارم
- أو استثناء Endpoints معينة

---

## 11. Order Update Validation

### المشكلة المحتملة
ماذا يحدث إذا حاول Kitchen تغيير حالة Order من `ready` إلى `new`؟

### الحل المطلوب
**نوع**: Validation
**الأهمية**: Medium
**Endpoint**: `PATCH /api/orders/:id/status`

**ما المطلوب:**
- Validation للـ status transitions المسموحة
- Error message واضح

---

## 12. Pagination Support

### المشكلة
مع زيادة عدد الطلبات، قد تصبح الـ Response كبيرة جداً

### الحل المطلوب
**نوع**: Enhancement
**الأهمية**: Low (Future)
**Endpoints**: `GET /api/orders`

**ما المطلوب:**
```
GET /api/orders?status=new&page=1&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 13. WebSocket Support (Future)

### المشكلة
حالياً Frontend يستخدم polling كل 30 ثانية

### الحل المطلوب
**نوع**: Enhancement (Future)
**الأهمية**: Low

**ما المطلوب:**
- WebSocket للتحديثات الفورية
- Socket.io أو مشابه

---

## 📋 ملخص الأولويات

### High Priority
1. ✅ توحيد حالات الطلبات ودعم `ready`
2. ✅ CORS Configuration
3. ✅ Order Items Details في Response

### Medium Priority
4. ✅ Kitchen Dashboard Response Structure
5. ✅ Session/Table Details في Orders
6. ✅ توثيق Permissions

### Low Priority
7. ✅ Token Expiration Documentation
8. ✅ Error Messages بالعربي
9. ✅ Pagination Support

---

## 📞 كيفية الإبلاغ عن المشاكل

إذا وجدت مشكلة أثناء التطوير:

1. افتح صفحة `/backend-notes` في التطبيق
2. أضف ملاحظة جديدة مع:
   - العنوان
   - الوصف التفصيلي
   - Endpoint المتأثر
   - النوع (Bug/Missing/Enhancement)
   - الأهمية
3. اضغط "تحميل ملف الملاحظات"
4. أرسل الملف لفريق Backend

---

## ✅ Checklist للـ Backend Team

- [ ] دعم حالة `ready` للطلبات
- [ ] توحيد Response structure
- [ ] Include MenuItem details في Order response
- [ ] Include Session/Table details في Order response
- [ ] تفعيل CORS
- [ ] توثيق Token expiration
- [ ] توثيق Permissions لكل Endpoint
- [ ] Validation لـ status transitions
- [ ] Error messages واضحة

---

**آخر تحديث:** 2024
**تم الإعداد بواسطة:** Frontend Team
