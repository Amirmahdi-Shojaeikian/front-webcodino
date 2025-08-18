export type Coupon = {
  code: string;
  title: string;
  amount: string; // درصد یا مبلغ
  expireAt: string;
  status: "فعال" | "منقضی";
};

export const coupons: Coupon[] = [
  { code: "WEB10", title: "۱۰٪ تخفیف خدمات وب", amount: "۱۰٪", expireAt: "1403/06/30", status: "فعال" },
  { code: "HOST50K", title: "۵۰هزار تومان تخفیف هاست", amount: "۵۰,۰۰۰ تومان", expireAt: "1403/05/30", status: "منقضی" },
];


