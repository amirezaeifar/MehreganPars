export type Story = { image: string; alt: [string, string]; title: [string, string]; note: [string, string]; audience: [string, string]; services: [string, string][] }
export const platformStories: Record<string, Story> = {
  'health-center': {
    image: '/images/overview-health.jpg', alt: ['همراهی در یک جلسه بازتوانی', 'Support during rehabilitation'],
    title: ['از یک گفت‌وگو، تا قدم‌های بهتر.', 'A conversation. A step forward.'],
    note: ['مراقبت از نزدیک', 'CARE, IN PERSON'],
    audience: ['وقتی به ارزیابی حضوری، درمان یا همراهی در بازتوانی نیاز دارید، آشنایی با خدمات مجتمع می‌تواند نقطه شروع شما باشد.', 'When you need an in-person assessment, treatment or recovery support, explore the centre as your starting point.'],
    services: [
      ['ارزیابی حرکت و آشنایی با مسیرهای فیزیوتراپی متناسب با نیاز شما.', 'Movement assessment and physiotherapy paths matched to your needs.'],
      ['آشنایی با خدمات آب‌درمانی و ماساژ و بررسی تناسب آن‌ها با شرایط شما.', 'Explore hydrotherapy and massage and discuss their suitability.'],
      ['حرکت هدفمند، با توجه به توانایی‌ها و برنامه مراقبت هر فرد.', 'Purposeful movement that reflects your abilities and care plan.'],
      ['گفت‌وگو درباره عادت‌های غذایی و نیازهای تغذیه‌ای روزمره.', 'Discuss daily eating habits and individual nutrition needs.'],
      ['توجه تخصصی به سلامت در فعالیت بدنی و بازگشت به ورزش.', 'Specialist attention to physical activity and returning to sport.'],
      ['آشنایی با حمایت‌های بازتوانی در طول مسیر سرطان و پس از آن.', 'Explore rehabilitation support during and after cancer care.']
    ]
  },
  physiopars: {
    image: '/images/movement.jpg', alt: ['حرکت آرام در نور روز', 'Gentle movement in daylight'],
    title: ['حرکت بهتر، در ریتم زندگی شما.', 'Better movement, at your pace.'], note: ['هر حرکت، یک شروع', 'ROOM TO MOVE'],
    audience: ['اگر برای حرکت، مراقبت از کمر یا زانو و ادامه تمرین‌های بازتوانی به راهنمایی نیاز دارید، از مسیرهای تخصصی فیزیوپارس شروع کنید.', 'Explore Physiopars for guidance on movement, back and knee care, and continuing rehabilitation exercises.'],
    services: [ ['آشنایی با ارزیابی و برنامه‌های مرتبط با حرکت و مراقبت از کمر.', 'Explore assessment and movement programmes for back care.'], ['مسیرهای تخصصی برای شناخت نیازهای حرکتی و مراقبت از زانو.', 'Focused paths for understanding knee movement and care needs.'], ['توجه به الگوهای حرکتی و تمرین‌های متناسب با وضعیت بدن.', 'Attention to movement patterns and exercises suited to your body.'], ['آشنایی با شیوه دریافت راهنمایی و پیگیری تمرین‌ها از راه دور.', 'Explore remote guidance and exercise follow-up.'] ]
  },
  oncopars: {
    image: '/images/daily-care.jpg', alt: ['همراهی و گفت‌وگو در مسیر مراقبت', 'Conversation and support through care'],
    title: ['در ادامه مسیر، کنار هم.', 'Together, along the way.'], note: ['برای روزهای پیش رو', 'LOOKING AHEAD'],
    audience: ['برای افرادی که با سرطان زندگی می‌کنند و خانواده‌هایی که همراه آن‌ها هستند؛ فضایی برای شناخت نیازهای بازتوانی و راه‌های حمایت.', 'For people living with cancer and families supporting them: a place to understand rehabilitation needs and available support.'],
    services: [ ['مطالب روشن برای شناخت دغدغه‌های روزمره در مسیر بازتوانی.', 'Clear reading on everyday concerns during rehabilitation.'], ['آشنایی با نقش بازتوانی و خدمات مرتبط با شرایط هر فرد.', 'Understand rehabilitation and services relevant to individual needs.'], ['توجه به پرسش‌ها و نقش نزدیکان در همراهی با فرد.', 'Attention to family questions and their role in supporting care.'] ]
  },
  psychopars: {
    image: '/images/quiet-moment.jpg', alt: ['فرصتی برای مکث و آرامش', 'A moment to pause and breathe'],
    title: ['برای خودتان، کمی فضای آرام.', 'A little space for yourself.'], note: ['فرصتی برای شنیده شدن', 'SPACE TO BE HEARD'],
    audience: ['وقتی می‌خواهید بیشتر به احساسات، عادت‌ها و کیفیت زندگی خود توجه کنید، سایکوپارس به شما کمک می‌کند مسیرهای مرتبط با سلامت روان را بشناسید.', 'When you want to pay closer attention to feelings, habits and quality of life, explore mental wellbeing through Psychopars.'],
    services: [ ['آشنایی با مفاهیم سلامت روان با زبانی نزدیک به زندگی روزمره.', 'Understand mental wellbeing through everyday language.'], ['توجه به عادت‌ها، استراحت و تعادل میان بخش‌های مختلف زندگی.', 'Explore habits, rest and balance in everyday life.'], ['شناخت مسیر گفت‌وگو و کمک گرفتن متناسب با دغدغه‌های شما.', 'Find a starting point for conversation and relevant support.'] ]
  },
  telenutrition: {
    image: '/images/nutrition.jpg', alt: ['مواد غذایی تازه برای یک وعده ساده', 'Fresh ingredients for a simple meal'],
    title: ['تغذیه بهتر، نزدیک به سفره شما.', 'Good food. Your everyday table.'], note: ['عادت‌های کوچک روزانه', 'EVERYDAY NOURISHMENT'],
    audience: ['اگر به دنبال شناخت نیازهای تغذیه‌ای و انتخاب‌های غذایی متناسب با زندگی خود هستید، با خدمات تله‌تغذیه آشنا شوید.', 'Explore Telenutrition to understand your nutrition needs and food choices that fit your life.'],
    services: [ ['گفت‌وگو درباره نیازها، ترجیح‌ها و پرسش‌های تغذیه‌ای شما.', 'Discuss your nutrition needs, preferences and questions.'], ['آشنایی با برنامه غذایی با توجه به شرایط و عادت‌های فردی.', 'Explore food planning that considers your circumstances and habits.'], ['مرور مسیر و پرسش‌های تازه در ادامه تغییر عادت‌های غذایی.', 'Revisit progress and new questions as eating habits change.'] ]
  }
}
