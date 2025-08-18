"use client";

import { useState } from "react";
import Link from "next/link";

export default function WalletPage() {
  const [balance] = useState(150000);
  const [transactions] = useState([
    {
      id: 1,
      type: "deposit",
      amount: 50000,
      description: "شارژ کیف پول",
      date: "۱۴۰۳/۰۸/۲۰",
      time: "۱۴:۳۰",
      status: "موفق"
    },
    {
      id: 2,
      type: "withdraw",
      amount: -25000,
      description: "خرید دوره React",
      date: "۱۴۰۳/۰۸/۱۸",
      time: "۱۰:۱۵",
      status: "موفق"
    },
    {
      id: 3,
      type: "deposit",
      amount: 100000,
      description: "شارژ کیف پول",
      date: "۱۴۰۳/۰۸/۱۵",
      time: "۱۶:۴۵",
      status: "موفق"
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* کارت موجودی و دکمه شارژ در یک باکس */}
      <div className="bg-background/30 backdrop-blur-sm rounded-lg p-6 border border-foreground/10 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">موجودی فعلی</h2>
            <p className="text-3xl font-bold text-foreground">{balance.toLocaleString()} تومان</p>
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
            شارژ کیف پول
          </button>
        </div>
      </div>

      {/* جدول تراکنش‌ها */}
      <div className="bg-background/50 backdrop-blur-sm rounded-lg shadow-sm border border-foreground/10">
        <div className="p-6 border-b border-foreground/10">
          <h3 className="text-lg font-semibold text-foreground">تراکنش‌های اخیر</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-foreground/5">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  نوع تراکنش
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  مبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  توضیحات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  تاریخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  ساعت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  وضعیت
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-foreground/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-accent/20' : 'bg-red-500/20'
                      }`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={transaction.type === 'deposit' ? 'text-accent' : 'text-red-400'}
                        >
                          {transaction.type === 'deposit' ? (
                            <path d="M12 5v14" />
                          ) : (
                            <path d="M12 19V5" />
                          )}
                        </svg>
                      </div>
                      <span className="mr-3 text-sm font-medium text-foreground">
                        {transaction.type === 'deposit' ? 'واریز' : 'برداشت'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-accent' : 'text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} تومان
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/60">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/60">
                    {transaction.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-accent/20 text-accent">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* دکمه بازگشت */}
      <div className="mt-8">
        <Link
          href="/account"
          className="inline-flex items-center text-primary hover:text-primary-light transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          بازگشت به پیشخوان
        </Link>
      </div>
    </div>
  );
}
