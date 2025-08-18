export type Subscription = {
  id: string;
  service: string;
  plan: string;
  price: string;
  period: string;
  status: "فعال" | "منقضی" | "در انتظار";
  startDate: string;
  endDate: string;
};

export const subscriptions: Subscription[] = [
  { id: "SUB-001", service: "هاست ایرانی", plan: "اقتصادی", price: "۵۰,۰۰۰ تومان", period: "ماهانه", status: "فعال", startDate: "1403/05/15", endDate: "1403/06/15" },
  { id: "SUB-002", service: "سرور خارجی", plan: "اختصاصی", price: "۹۰۰,۰۰۰ تومان", period: "ماهانه", status: "در انتظار", startDate: "1403/05/20", endDate: "1403/06/20" },
  { id: "SUB-003", service: "سایت فروشگاهی", plan: "پرو", price: "۲,۰۰۰,۰۰۰ تومان", period: "سالانه", status: "منقضی", startDate: "1402/01/01", endDate: "1402/12/01" },
];

export function findSubscriptionById(id: string): Subscription | undefined {
  return subscriptions.find((s) => s.id === id);
}


