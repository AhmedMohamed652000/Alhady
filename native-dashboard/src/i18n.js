const translations = {
  ar: {
    // App
    'Midnight Pro': 'لوحة التحكم',

    // Navigation
    'Tools': 'الأدوات',
    'Clients': 'العملاء',
    'Partners': 'الشركاء',
    'Team': 'الفريق',
    'Projects': 'المشاريع',
    'Portfolio': 'معرض الأعمال',
    'Reviews': 'التقييمات',
    'Jobs': 'الوظائف',
    'Settings': 'الإعدادات',

    // Auth
    'Sign in to access dashboard': 'تسجيل الدخول للوصول إلى لوحة التحكم',
    'Email': 'البريد الإلكتروني',
    'Password': 'كلمة المرور',
    'Sign In': 'تسجيل الدخول',
    'Login failed': 'فشل تسجيل الدخول',
    'Server error. Please try again.': 'خطأ في الخادم. حاول مرة أخرى.',
    'Sign Out': 'تسجيل الخروج',

    // CRUD generic
    'Add New': 'إضافة جديد',
    'Actions': 'الإجراءات',
    'Save': 'حفظ',
    'Cancel': 'إلغاء',
    'Saving...': 'جارٍ الحفظ...',
    'No data found': 'لا توجد بيانات',
    'Are you sure you want to delete this item?': 'هل أنت متأكد من حذف هذا العنصر؟',
    'Image upload failed': 'فشل رفع الصورة',
    'Yes': 'نعم',
    'No': 'لا',
    'Manage your {title} here.': 'إدارة {title} هنا.',
    'Add {title}': 'إضافة {title}',
    'Edit {title}': 'تعديل {title}',
    'Operation failed: {message}': 'فشلت العملية: {message}',

    // Settings page
    'System Settings': 'إعدادات النظام',
    'Configure global dashboard preferences here.': 'تكوين الإعدادات العامة للوحة التحكم هنا.',
    'Save Settings': 'حفظ الإعدادات',
    'Settings saved successfully!': 'تم حفظ الإعدادات بنجاح!',
    'Error saving settings: {message}': 'خطأ في حفظ الإعدادات: {message}',

    // Gallery manager
    'Project Gallery Images': 'صور معرض المشروع',
    'Upload and manage gallery images for each project.': 'رفع وإدارة صور المعرض لكل مشروع.',
    'Select Project': 'اختر مشروعاً',
    '— Choose a project —': '— اختر مشروعاً —',
    'Click or drag images here to upload': 'انقر أو اسحب الصور هنا للرفع',
    'PNG, JPG, WebP – max 5MB each · Multiple files allowed': 'PNG، JPG، WebP — الحد الأقصى 5MB · يُسمح برفع ملفات متعددة',
    'Upload in progress — please wait…': 'جارٍ الرفع — يرجى الانتظار…',
    'Uploading {done} of {total} images…': 'جارٍ رفع {done} من {total} صورة…',
    'Processing: {filename}': 'جارٍ المعالجة: {filename}',
    '{done} images uploaded. {failed} failed — check console.': 'تم رفع {done} صورة. فشل {failed} — راجع وحدة التحكم.',
    'No gallery images yet.': 'لا توجد صور في المعرض بعد.',
    'Upload images using the zone above.': 'ارفع الصور باستخدام المنطقة أعلاه.',
    'Image Details': 'تفاصيل الصورة',
    'Caption / Title': 'التسمية / العنوان',
    'Description': 'الوصف',
    'e.g. Main Entrance': 'مثال: المدخل الرئيسي',
    'Short description…': 'وصف مختصر…',
    'Remove': 'إزالة',
    'Remove this image from the gallery?': 'هل تريد إزالة هذه الصورة من المعرض؟',
    '(no caption)': '(بدون تسمية)',
    'Edit': 'تعديل',
    'Saving…': 'جارٍ الحفظ…',
    'Failed to save: {message}': 'فشل الحفظ: {message}',
    'Failed to remove image: {message}': 'فشل حذف الصورة: {message}',
    'Search...': 'بحث...',

    // Field labels
    'Page': 'الصفحة',
    'Title': 'العنوان',
    'Image': 'الصورة',
    'Subtitle': 'العنوان الفرعي',
    'Background Image': 'صورة الخلفية',
    'Icon': 'الأيقونة',
    'Active': 'مفعّل',
    'Slider Image': 'صورة السلايدر',
    'Card Image': 'صورة البطاقة',
    'Link': 'الرابط',
    'Order': 'الترتيب',
    'Service': 'الخدمة',
    'Service Category': 'فئة الخدمة',
    'Home Card Image': 'صورة البطاقة الرئيسية',
    'Project Image': 'صورة المشروع',
    'Header': 'الترويسة',
    'Project Type': 'نوع المشروع',
    'Client': 'العميل',
    'Year': 'السنة',
    'Location': 'الموقع',
    'Size': 'الحجم',
    'Time': 'المدة',
    'People': 'عدد العاملين',
    'Cost': 'التكلفة',
    'Stats Icon': 'أيقونة الإحصاءات',
    'Name': 'الاسم',
    'Position': 'المنصب',
    'Profile Image': 'صورة الملف الشخصي',
    'Job Title': 'المسمى الوظيفي',
    'Company Name': 'اسم الشركة',
    'Phone': 'الهاتف',
    'Address': 'العنوان',
    'Years Experience': 'سنوات الخبرة',
    'Projects Completed': 'المشاريع المنجزة',
    'Team Size': 'حجم الفريق',
    'About Description': 'وصف نبذة عنا',
    'Hero Title': 'عنوان البانر الرئيسي',
    'Hero Subtitle': 'العنوان الفرعي للبانر',
    'Salary': 'الراتب',
    'Requirements': 'المتطلبات',
    'Type': 'النوع',
  }
};

let currentLang = localStorage.getItem('alhady_lang') || 'ar';

export const getLang = () => currentLang;

export const setLang = (lang) => {
  currentLang = lang;
  localStorage.setItem('alhady_lang', lang);
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  html.dataset.lang = lang;
};

export const t = (key, vars = {}) => {
  let text = (currentLang === 'ar' && translations.ar[key] !== undefined)
    ? translations.ar[key]
    : key;
  Object.entries(vars).forEach(([k, v]) => {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  });
  return text;
};

// Apply direction and language to HTML element immediately at module load
setLang(currentLang);
