// The entire experience is Persian, including stored sessions and administration.
export function t(fa: string, _en?: string) { return fa }
export const locale = () => 'fa-IR'
export function publicationDate(value: string) { return value }
if (typeof document !== 'undefined') { document.documentElement.lang = 'fa'; document.documentElement.dir = 'rtl'; document.title = 'مهرگان پارس | یک خانواده برای سلامت' }
