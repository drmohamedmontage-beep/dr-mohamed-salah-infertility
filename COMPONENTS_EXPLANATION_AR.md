# 📚 شرح المكونات الجديدة

## 1. 🔐 LoginPage.jsx - صفحة تسجيل الدخول

**الموقع:** `src/components/LoginPage.jsx`

### الميزات:
- ✅ تسجيل دخول للمستخدمين الحاليين
- ✅ إنشاء حساب جديد
- ✅ التحقق من صحة البيانات
- ✅ رسائل خطأ واضحة
- ✅ دعم ثنائي اللغة

### الاستخدام:
```jsx
import LoginPage from './components/LoginPage'

<LoginPage onLoginSuccess={() => console.log('تم التسجيل')} />
```

### المخرجات:
- حفظ بيانات المستخدم في Supabase
- إعادة توجيه إلى لوحة التحكم أو معالج التشخيص

---

## 2. 🛡️ useAuth.js - خدمة المصادقة

**الموقع:** `src/lib/useAuth.js`

### الدوال الرئيسية:

#### `signUp(email, password, profileData)`
```javascript
const auth = useAuth()
await auth.signUp('user@email.com', 'password123', {
  name: 'د. محمد',
  specialization: 'doctor',
  clinic: 'عيادة الخصوبة'
})
```

#### `signIn(email, password)`
```javascript
await auth.signIn('user@email.com', 'password123')
```

#### `signOut()`
```javascript
await auth.signOut()
```

#### `hasPermission(permission)`
```javascript
if (auth.hasPermission('manage_patients')) {
  // يمكنه إدارة المرضى
}
```

### الخصائص:
- `auth.user` - معلومات المستخدم الحالي
- `auth.profile` - الملف الشخصي (الاسم، التخصص، إلخ)
- `auth.loading` - هل جاري التحميل؟
- `auth.error` - رسالة الخطأ
- `auth.isAuthenticated` - هل مسجل دخول؟
- `auth.isAdmin` - هل مسؤول؟

---

## 3. 📊 supabase.js - خدمات قاعدة البيانات

**الموقع:** `src/lib/supabase.js`

### الخدمات المتاحة:

### أ) `patientService` - إدارة المرضى

```javascript
// الحصول على جميع المرضى
const { data, error } = await patientService.getAll()

// البحث عن مريض
const { data } = await patientService.getById(id)

// إضافة مريض
await patientService.create({
  name: 'فاطمة أحمد',
  age: 28,
  phone: '0501234567',
  type: 'primary'
})

// تحديث مريض
await patientService.update(id, { status: 'inactive' })

// حذف مريض
await patientService.delete(id)

// البحث
await patientService.search('فاطمة')
```

### ب) `diagnosisService` - التشخيصات

```javascript
// الحصول على تشخيصات المريض
const { data } = await diagnosisService.getByPatient(patientId)

// إضافة تشخيص
await diagnosisService.create({
  patient_id: patientId,
  diagnosis: 'PCOS',
  severity: 'moderate'
})

// تحديث تشخيص
await diagnosisService.update(id, { status: 'treated' })
```

### ج) `prescriptionService` - الوصفات

```javascript
// وصفات المريض
const { data } = await prescriptionService.getByPatient(patientId)

// إضافة وصفة
await prescriptionService.create({
  diagnosis_id: diagnosisId,
  medicine_id: medicineId,
  dosage: '2 tablets daily',
  duration: '3 months'
})
```

### د) `medicineService` - الأدوية

```javascript
// جميع الأدوية
const { data } = await medicineService.getAll()

// البحث عن دواء
const { data } = await medicineService.getAll({ 
  search: 'metformin' 
})

// إضافة دواء
await medicineService.create({
  name: 'Metformin 500mg',
  category: 'PCOS',
  dosage: '500mg'
})
```

### هـ) `userService` - المستخدمون

```javascript
// ملف المستخدم الحالي
const { data } = await userService.getProfile(userId)

// جميع موظفي العيادة
const { data } = await userService.getAllStaff(clinicId)

// منح صلاحية
await userService.grantPermission(userId, 'manage_patients')

// سحب صلاحية
await userService.revokePermission(userId, 'manage_patients')
```

### و) `auditService` - السجلات

```javascript
// تسجيل نشاط
await auditService.log(
  'CREATE_PATIENT',
  'تم إنشاء مريض جديد',
  userId
)

// سجل المستخدم
const { data } = await auditService.getByUser(userId)

// جميع السجلات
const { data } = await auditService.getAll()
```

### ز) `analyticsService` - الإحصائيات

```javascript
// إحصائيات العيادة
const stats = await analyticsService.getStats(clinicId)
// { totalPatients, totalDiagnoses }

// إحصائيات المريض
const stats = await analyticsService.getPatientStats(patientId)
// { diagnosisCount, prescriptionCount, lastDiagnosis }
```

---

## 4. 🎛️ AdminDashboard.jsx - لوحة التحكم

**الموقع:** `src/components/AdminDashboard.jsx`

### 5 علامات تبويب:

#### 1️⃣ Overview
- عدد المرضى الكلي
- عدد التشخيصات
- عدد الأدوية
- عدد الموظفين

#### 2️⃣ Patients
جدول يعرض:
- اسم المريض
- العمر
- الهاتف
- تاريخ التسجيل

#### 3️⃣ Medicines
بطاقات تعرض:
- اسم الدواء
- الفئة
- الجرعة
- الوصف

#### 4️⃣ Staff (للمسؤول فقط)
جدول يعرض:
- الاسم
- الدور (طبيب/ممرضة/مسؤول)
- التخصص
- الحالة

#### 5️⃣ Audit Logs (للمسؤول فقط)
جدول يعرض:
- الإجراء (CREATE/UPDATE/DELETE)
- التفاصيل
- التاريخ والوقت

---

## 5. 👥 PatientManagement.jsx - إدارة المرضى

**الموقع:** `src/components/PatientManagement.jsx`

### الميزات:

#### إضافة مريض
```
اضغط "+ إضافة مريض" → ملء النموذج → حفظ
```

#### البيانات المطلوبة:
- اسم المريض
- العمر
- الهاتف
- البريد الإلكتروني
- نوع العقم (أولي/ثانوي)
- مدة العقم
- الحالة (نشط/غير نشط)

#### تحديث المريض
```
اضغط أيقونة التعديل → عدّل البيانات → حفظ
```

#### حذف المريض
```
اضغط أيقونة الحذف → تأكيد → حذف
```

#### البحث
```
اكتب في خانة البحث → يتم البحث تلقائيًا
البحث يعمل عن الاسم والهاتف
```

---

## 6. 🔄 تكامل الكود

### مثال عملي: إضافة مريض وحفظه

```javascript
import { patientService, auditService } from './lib/supabase'
import useAuth from './lib/useAuth'

export default function MyComponent() {
  const auth = useAuth()

  const handleAddPatient = async (patientData) => {
    // 1. إضافة المريض
    const { data, error } = await patientService.create(patientData)
    
    if (!error) {
      // 2. تسجيل النشاط
      await auditService.log(
        'CREATE_PATIENT',
        `تم إضافة مريض: ${patientData.name}`,
        auth.user?.id
      )
      
      console.log('تم الحفظ بنجاح!')
    } else {
      console.error('حدث خطأ:', error)
    }
  }

  return (
    <button onClick={() => handleAddPatient({...})}>
      إضافة مريض
    </button>
  )
}
```

---

## 7. 🔗 سير عمل التطبيق

```
المستخدم
    ↓
LoginPage (تسجيل دخول)
    ↓
useAuth (التحقق من الصلاحيات)
    ├→ هل مسؤول؟ → AdminDashboard
    └→ طبيب عادي؟ → معالج التشخيص
    ↓
supabase.js (حفظ البيانات)
    ├→ المرضى
    ├→ التشخيصات
    ├→ الوصفات
    ├→ السجلات
    └→ الإحصائيات
```

---

## 8. 📱 مثال كامل: عرض المرضى

```jsx
import React, { useState, useEffect } from 'react'
import { patientService } from './lib/supabase'

export default function PatientsList() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    setLoading(true)
    const { data, error } = await patientService.getAll()
    
    if (!error) {
      setPatients(data)
    }
    setLoading(false)
  }

  if (loading) return <p>جاري التحميل...</p>

  return (
    <table>
      <thead>
        <tr>
          <th>الاسم</th>
          <th>العمر</th>
          <th>الهاتف</th>
        </tr>
      </thead>
      <tbody>
        {patients.map(patient => (
          <tr key={patient.id}>
            <td>{patient.name}</td>
            <td>{patient.age}</td>
            <td>{patient.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

---

## 9. ⚙️ الإعدادات والمتغيرات البيئية

**الملف:** `.env`

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here

# التطبيق
VITE_APP_NAME=Infertility CDSS
VITE_APP_VERSION=1.0.0

# الميزات
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AUDIT_LOG=true
VITE_ENABLE_EXPORT_PDF=true
VITE_ENABLE_BACKUP=true

# المزامنة
VITE_AUTO_SYNC=true
VITE_SYNC_INTERVAL=300000
```

---

## 10. 🚀 النشر على الإنترنت

بعد اختبار التطبيق محليًا:

```bash
# بناء النسخة الإنتاجية
npm run build

# سينشئ مجلد dist جاهز للنشر
```

ثم استخدم:
- **Vercel** (موصى به)
- **Netlify**
- **GitHub Pages**
- **AWS S3**

---

## 📖 روابط مفيدة

- [شرح Supabase](https://supabase.com/docs)
- [React Hooks](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com)
- [دليل المشروع الكامل](./DATABASE_SETUP_GUIDE_AR.md)

---

**تم شرح جميع المكونات الجديدة! 🎉**
