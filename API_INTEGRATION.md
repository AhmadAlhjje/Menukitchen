# توثيق التكامل مع Backend API

## 📡 نظرة عامة

هذا المشروع متكامل بالكامل مع الـ Backend API المُوثّق في ملف Postman Collection المرفق.

## 🔗 Base URL

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

يمكن تغييره من ملف `.env.local`

## 🔐 المصادقة (Authentication)

### Login
```typescript
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  token: string,
  user: User
}
```

**الاستخدام في الكود:**
```typescript
// src/hooks/useAuth.ts
const login = async (credentials: LoginRequest) => {
  const response = await axiosInstance.post('/api/auth/login', credentials);
  const { token, user } = response.data;
  // تخزين في Redux و localStorage
}
```

### Logout
```typescript
POST /api/auth/logout
Headers: { Authorization: Bearer <token> }
```

### Get Current User
```typescript
GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: {
  user: User
}
```

## 📋 الطلبات (Orders)

### Get Orders by Status
```typescript
GET /api/orders?status=new
GET /api/orders?status=ready
Headers: { Authorization: Bearer <token> }
Response: {
  orders: Order[]
}
```

**الاستخدام في الكود:**
```typescript
// src/hooks/useOrders.ts
const fetchNewOrders = async () => {
  const response = await axiosInstance.get('/api/orders', {
    params: { status: 'new' }
  });
  return response.data.orders || response.data.data || [];
}
```

### Get Order by ID
```typescript
GET /api/orders/:id
Headers: { Authorization: Bearer <token> }
Response: {
  order: Order
}
```

### Update Order Status
```typescript
PATCH /api/orders/:id/status
Headers: { Authorization: Bearer <token> }
Body: {
  status: "ready"
}
Response: {
  order: Order
}
```

**الاستخدام:**
```typescript
// src/hooks/useOrders.ts
const markOrderAsReady = async (orderId: number) => {
  await axiosInstance.patch(`/api/orders/${orderId}/status`, {
    status: 'ready'
  });
}
```

## 🏪 الجلسات (Sessions)

### Get Session by ID
```typescript
GET /api/sessions/:id
Headers: { Authorization: Bearer <token> }
Response: {
  session: Session
}
```

### Get Active Sessions
```typescript
GET /api/kitchen/sessions/active
Headers: { Authorization: Bearer <token> }
Response: {
  sessions: Session[]
}
```

### Get Orders by Session
```typescript
GET /api/orders/session/:sessionId
Headers: { Authorization: Bearer <token> }
Response: {
  orders: Order[]
}
```

**الاستخدام:**
```typescript
// src/hooks/useSessions.ts
const getSessionOrders = async (sessionId: number) => {
  const response = await axiosInstance.get(`/api/orders/session/${sessionId}`);
  return response.data.orders || response.data.data || [];
}
```

### Close Session
```typescript
POST /api/kitchen/sessions/:id/close
Headers: { Authorization: Bearer <token> }
Body: {
  notes?: string
}
```

## 📊 Dashboard Stats

### Get Kitchen Dashboard
```typescript
GET /api/kitchen/dashboard
Headers: { Authorization: Bearer <token> }
Response: {
  newOrdersCount: number,
  readyOrdersCount: number,
  activeSessionsCount: number,
  todayOrdersCount: number
}
```

**الاستخدام:**
```typescript
// src/hooks/useDashboard.ts
const fetchDashboardStats = async () => {
  const response = await axiosInstance.get('/api/kitchen/dashboard');
  return response.data.data || response.data;
}
```

## 🔧 Axios Configuration

### Automatic Token Injection
```typescript
// src/lib/axios.ts
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('kitchen_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Error Handling
```typescript
// src/lib/axios.ts
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // تسجيل الخروج تلقائياً
      localStorage.removeItem('kitchen_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 📝 Response Handling

يدعم المشروع صيغ متعددة من الـ Response:

```typescript
// الصيغة 1
{
  orders: Order[]
}

// الصيغة 2
{
  data: Order[]
}

// الصيغة 3
Order[]
```

**معالجة تلقائية:**
```typescript
const orders = response.data.orders || response.data.data || response.data || [];
```

## ⚠️ ملاحظات مهمة

### 1. حالات الطلبات
النظام يدعم حالتين فقط:
- `new`: طلبات جديدة
- `ready`: طلبات جاهزة

أي حالة أخرى في الـ API يتم تجاهلها.

### 2. Token Storage
التوكن يُحفظ في:
- Redux Store (للحالة المؤقتة)
- localStorage (للحالة الدائمة)
- Axios Headers (تلقائياً)

### 3. Error Messages
جميع الأخطاء تُعرض للمستخدم عبر Toast Notifications:

```typescript
try {
  // API call
} catch (error: any) {
  const message = error.response?.data?.message || 'Default error';
  toast.error(message);
}
```

## 🐛 معالجة الأخطاء الشائعة

### Network Error
```typescript
if (!error.response) {
  toast.error(t('errors.networkError'));
}
```

### 401 Unauthorized
```typescript
if (error.response.status === 401) {
  toast.error(t('errors.unauthorized'));
  // Auto logout
}
```

### 404 Not Found
```typescript
if (error.response.status === 404) {
  toast.error(t('errors.notFound'));
}
```

### 500 Server Error
```typescript
if (error.response.status >= 500) {
  toast.error(t('errors.serverError'));
}
```

## 🔄 Auto Refresh

الطلبات تُحدّث تلقائياً كل 30 ثانية:

```typescript
// src/hooks/useOrders.ts
useEffect(() => {
  fetchAllOrders();

  const interval = setInterval(() => {
    fetchAllOrders();
  }, 30000); // 30 seconds

  return () => clearInterval(interval);
}, []);
```

## 📋 Order Structure

```typescript
interface Order {
  id: number;
  sessionId: number;
  status: 'new' | 'ready';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  session?: Session;
}

interface OrderItem {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  price: number;
  notes?: string;
  item?: MenuItem;
}
```

## 🧪 اختبار الاتصال

للتأكد من عمل الـ API:

1. تشغيل Backend على المنفذ 5000
2. فتح المتصفح والذهاب لـ Console
3. تنفيذ:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'kitchen@restaurant.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(console.log)
```

## 📞 الدعم

إذا واجهت مشاكل في الاتصال:

1. تأكد من تشغيل Backend
2. تأكد من Base URL الصحيح
3. افتح Network Tab في DevTools
4. تحقق من Console للأخطاء
5. راجع CORS settings في Backend

## ✅ Checklist للتكامل الناجح

- [x] Base URL صحيح في `.env.local`
- [x] Backend يعمل ويستجيب
- [x] CORS مفعّل في Backend
- [x] Token يُرسل في Headers
- [x] Response structure متطابق
- [x] Error handling يعمل
- [x] Auto-refresh مفعّل
- [x] Login/Logout يعملان
