export interface Platform {
  slug: string
  name: string
  eyebrow: string
  description: string
  longDescription: string
  category: 'clinic' | 'digital'
  icon: string
  color: string
  services: string[]
}

export const platforms: Platform[] = [
  {
    slug: 'health-center', name: 'مجتمع سلامت مهرگان', eyebrow: 'مراقبت حضوری',
    description: 'خدمات تخصصی سلامت و توانبخشی، نزدیک و همراه شما.',
    longDescription: 'از ارزیابی اولیه تا ادامه مسیر درمان و تندرستی، خدمات حضوری مجتمع سلامت مهرگان با نگاه چندرشته‌ای کنار شماست.',
    category: 'clinic', icon: 'heart', color: 'mint',
    services: ['فیزیوتراپی', 'آب‌درمانی و ماساژ', 'ورزش درمانی', 'کلینیک تغذیه', 'طب ورزشی', 'توانبخشی سرطان'],
  },
  {
    slug: 'physiopars', name: 'فیزیوپارس', eyebrow: 'فیزیوتراپی دیجیتال',
    description: 'برنامه‌های تخصصی حرکت و بازتوانی در دسترس شما.',
    longDescription: 'فیزیوپارس مسیری برای آشنایی با برنامه‌های تخصصی فیزیوتراپی و تمرین‌های متناسب با نیازهای مختلف است.',
    category: 'digital', icon: 'activity', color: 'blue',
    services: ['فیزیوپارس کمر', 'فیزیوپارس زانو', 'فیزیوپارس اصلاحی', 'فیزیوتراپی از راه دور'],
  },
  {
    slug: 'oncopars', name: 'آنکوپارس', eyebrow: 'همراهی در بازتوانی',
    description: 'مراقبت و آموزش برای مسیر بازتوانی در سرطان.',
    longDescription: 'آنکوپارس بر نیازهای بازتوانی افراد درگیر سرطان و خانواده‌هایشان تمرکز دارد و مسیرهای حمایتی را معرفی می‌کند.',
    category: 'digital', icon: 'sparkles', color: 'peach',
    services: ['آموزش و آگاهی', 'بازتوانی تخصصی', 'همراهی خانواده'],
  },
  {
    slug: 'psychopars', name: 'سایکوپارس', eyebrow: 'سلامت روان',
    description: 'نگاهی انسانی به آرامش ذهن و کیفیت زندگی.',
    longDescription: 'سایکوپارس فضایی برای معرفی خدمات و محتوای مرتبط با سلامت روان و کیفیت زندگی در اکوسیستم مهرگان است.',
    category: 'digital', icon: 'flower', color: 'lavender',
    services: ['آموزش سلامت روان', 'سبک زندگی', 'حمایت روانی'],
  },
  {
    slug: 'hydrotherapy', name: 'آب‌درمانی', eyebrow: 'بازتوانی در آب',
    description: 'حرکت و بازتوانی با همراهی متخصص در محیط آب.',
    longDescription: 'آب‌درمانی مهرگان مسیر آشنایی با تمرین‌های درمانی در آب و ارزیابی تناسب آن‌ها با شرایط هر فرد است.',
    category: 'clinic', icon: 'waves', color: 'aqua',
    services: ['ارزیابی پیش از آب‌درمانی', 'تمرین درمانی در آب', 'بازتوانی حرکت'],
  },
  {
    slug: 'shop', name: 'فروشگاه', eyebrow: 'لوازم فیزیوتراپی',
    description: 'پک‌ها و لوازم مصرفی فیزیوتراپی برای مراقبت در خانه.',
    longDescription: 'فروشگاه مهرگان مجموعه‌ای از پک‌های کمر، گردن و زانو و لوازم کاربردی فیزیوتراپی را معرفی می‌کند.',
    category: 'digital', icon: 'bag', color: 'sand',
    services: ['پک مراقبت کمر', 'پک مراقبت گردن', 'پک مراقبت زانو'],
  },
]

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  readMinutes: number
  publishedAt: string
  status: 'published' | 'draft'
  body: string
  cover: string
}

export const initialArticles: Article[] = [
  {
    id: '1', slug: 'movement-for-a-better-day', title: 'حرکت‌های کوچک، حال بهتر در هر روز',
    excerpt: 'چطور چند عادت حرکتی ساده می‌تواند به مراقبت از بدن در طول روز کمک کند؟',
    category: 'سبک زندگی', author: 'تحریریه مهرگان', readMinutes: 5, publishedAt: '۱۴۰۵/۰۷/۱۲', status: 'published',
    body: 'مراقبت از بدن همیشه به برنامه‌های پیچیده نیاز ندارد. گاهی چند دقیقه حرکت ملایم میان کارهای روزانه، فرصتی برای توجه دوباره به بدن فراهم می‌کند.\n\nاگر مدت زیادی پشت میز می‌نشینید، در فاصله‌های منظم برخیزید، کمی قدم بزنید و وضعیت نشستن خود را تغییر دهید. برای انتخاب تمرین مناسب با شرایط جسمی خود، از متخصص کمک بگیرید.',
    cover: 'mint',
  },
  {
    id: '2', slug: 'knee-health-guide', title: 'برای مراقبت از زانو از کجا شروع کنیم؟',
    excerpt: 'نگاهی ساده به نقش ارزیابی تخصصی، فعالیت مناسب و پیگیری در سلامت زانو.',
    category: 'فیزیوتراپی', author: 'تحریریه مهرگان', readMinutes: 6, publishedAt: '۱۴۰۵/۰۷/۰۸', status: 'published',
    body: 'زانو در بسیاری از فعالیت‌های روزمره نقش دارد. وقتی درد یا محدودیت حرکت ایجاد می‌شود، شناخت علت آن اولین قدم است.\n\nشدت، مدت و شرایط شروع درد می‌تواند در تصمیم‌گیری درمانی مؤثر باشد. برنامه تمرینی باید با وضعیت هر فرد هماهنگ شود؛ به همین دلیل ارزیابی توسط متخصص اهمیت دارد.',
    cover: 'blue',
  },
  {
    id: '3', slug: 'mind-and-recovery', title: 'آرامش ذهن در مسیر بازتوانی',
    excerpt: 'بازتوانی فقط به حرکت محدود نیست؛ ذهن و حمایت اطرافیان هم بخشی از مسیرند.',
    category: 'سلامت روان', author: 'تحریریه مهرگان', readMinutes: 4, publishedAt: '۱۴۰۵/۰۷/۰۴', status: 'published',
    body: 'مسیر بازتوانی برای هر فرد تجربه‌ای متفاوت است. توجه به احساسات، پرسیدن سؤال از تیم درمان و دریافت حمایت از اطرافیان می‌تواند پیمودن این مسیر را آسان‌تر کند.\n\nاگر فشار روانی ادامه‌دار است یا زندگی روزانه را مختل می‌کند، گفت‌وگو با متخصص سلامت روان می‌تواند کمک‌کننده باشد.',
    cover: 'peach',
  },
  {
    id: '4', slug: 'nutrition-in-recovery', title: 'تغذیه در دوران بازتوانی',
    excerpt: 'پیش‌نویس راهنمای تغذیه متناسب با نیازهای فردی در مسیر بهبودی.',
    category: 'تغذیه', author: 'تحریریه مهرگان', readMinutes: 7, publishedAt: '۱۴۰۵/۰۷/۰۱', status: 'draft',
    body: 'تغذیه مناسب بخشی از مسیر مراقبت است. نیازهای هر فرد بسته به شرایط و برنامه درمانی متفاوت خواهد بود.',
    cover: 'lime',
  },
]
