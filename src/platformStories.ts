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
  hydrotherapy: {
    image: '/images/directory-hydrotherapy.jpg', alt: ['استخر آب‌درمانی و تجهیزات تمرین در آب', 'Hydrotherapy pool and aquatic exercise equipment'],
    title: ['حرکت در آب، با توجه به شما', 'Movement in water, shaped around you'], note: ['بازتوانی در آب', 'CARE IN WATER'],
    audience: ['برای آشنایی با تمرین‌های درمانی در آب و بررسی تناسب آن با شرایط خود، از ارزیابی تخصصی شروع کنید.', 'Start with a specialist assessment to see whether hydrotherapy suits your needs.'],
    services: [['ارزیابی وضعیت و هدف‌های حرکتی پیش از شروع', 'Assessment of movement goals before starting'], ['تمرین‌های فردی متناسب با توان و شرایط شما', 'Exercises adapted to your needs'], ['پیگیری مسیر بازتوانی با متخصص', 'Follow-up with a specialist']]
  },
  shop: {
    image: '/images/directory-shop.jpg', alt: ['پک‌ها و لوازم مراقبت و فیزیوتراپی', 'Physiotherapy supplies and care kits'],
    title: ['مراقبت در خانه، با ابزار مناسب', 'The right tools for care at home'], note: ['لوازم فیزیوتراپی', 'PHYSIOTHERAPY SUPPLIES'],
    audience: ['پک‌های مراقبت کمر، گردن و زانو و لوازم مصرفی فیزیوتراپی را ببینید.', 'Explore care kits for the back, neck and knee, plus physiotherapy supplies.'],
    services: [['پک مراقبت کمر برای استفاده روزمره', 'Back care kit for everyday use'], ['پک مراقبت گردن برای پشتیبانی بیشتر', 'Neck care kit for added support'], ['پک مراقبت زانو برای ادامه مسیر حرکت', 'Knee care kit for your movement journey']]
  }
}
