export type OrderRow = {
  id: string;
  date: string;
  items: string;
  amount: string;
  status: "پرداخت شده" | "در حال پردازش" | "مرجوع" | "فعال" | "تکمیل شده" | "در انتظار";
};

export const orders: OrderRow[] = [
  { id: "ORD-1001", date: "1403/05/01", items: "هاست ایرانی + دامنه", amount: "۵۵۰,۰۰۰ تومان", status: "پرداخت شده" },
  { id: "ORD-1002", date: "1403/05/10", items: "سرور اختصاصی", amount: "۹۰۰,۰۰۰ تومان", status: "در حال پردازش" },
  { id: "ORD-1003", date: "1403/05/15", items: "طراحی سایت فروشگاهی", amount: "۲,۰۰۰,۰۰۰ تومان", status: "مرجوع" },
];

export function findOrderById(id: string): OrderRow | undefined {
  return orders.find((o) => o.id === id);
}


