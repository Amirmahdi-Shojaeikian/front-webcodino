"use client";

import { useEffect, useState } from "react";
import { fetchContactsAdmin, updateContactStatusAdmin } from "@/lib/contact";

type ContactForm = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
  status: "new" | "answered";
  createdAt: string;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactForm | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "answered">("all");

  useEffect(() => {
    setIsLoading(true);
    fetchContactsAdmin().then((res) => {
      const response = res as { data?: ContactForm[] };
      const data = Array.isArray(response?.data) ? response.data : [];
      setContacts(data);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const filteredContacts = contacts.filter(contact => 
    filter === "all" ? true : contact.status === filter
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      new: { label: "جدید", className: "bg-red-900/20 text-red-400 border border-red-500/30" },
      answered: { label: "پاسخ داده شده", className: "bg-green-900/20 text-green-400 border border-green-500/30" }
    };
    const config = statusConfig[status] || { label: status, className: "bg-gray-900/20 text-gray-300 border border-gray-500/30" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getSubjectLabel = (subject: string) => {
    const map: Record<string, string> = {
      consult: "مشاوره",
      support: "پشتیبانی",
      cooperation: "پیشنهاد همکاری",
      order: "سفارش پروژه",
      other: "سایر",
    };
    return map[subject] || subject;
  };



  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">فرم‌های تماس</h1>
        <div className="flex items-center gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as "all" | "new" | "answered")}
            className="rounded-lg border px-3 py-2 bg-background"
          >
            <option value="all">همه</option>
            <option value="new">جدید</option>
            <option value="read">خوانده شده</option>
            <option value="replied">پاسخ داده شده</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-foreground/70">در حال بارگذاری...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* لیست فرم‌ها */}
          <div className="lg:col-span-1">
            <div className="border rounded-2xl p-4 bg-background">
              <h2 className="text-lg font-bold mb-4">لیست فرم‌ها ({filteredContacts.length})</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedContact?._id === contact._id 
                        ? "bg-blue-900/20 border border-blue-500/30" 
                        : "bg-background/50 hover:bg-background/80 border border-border/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{contact.name}</div>
                      {getStatusBadge(contact.status)}
                    </div>
                    <div className="text-xs text-foreground/70 mb-1">{getSubjectLabel(contact.subject)}</div>
                    <div className="text-xs text-foreground/50">{new Date(contact.createdAt).toLocaleString('fa-IR')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* جزئیات فرم انتخاب شده */}
          <div className="lg:col-span-2">
            {selectedContact ? (
              <div className="border rounded-2xl p-6 bg-background">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">جزئیات فرم</h2>
                                     <div className="flex items-center gap-2">
                     {selectedContact.status !== "answered" && (
                       <button
                         onClick={() => updateContactStatusAdmin(selectedContact._id, "answered").then(() => setSelectedContact({ ...selectedContact, status: "answered" }))}
                         className="px-3 py-1 bg-green-900/20 text-green-400 border border-green-500/30 rounded-lg text-sm hover:bg-green-900/30"
                       >
                         علامت‌گذاری به عنوان پاسخ داده شده
                       </button>
                     )}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                     <div>
                     <label className="block text-sm font-medium text-foreground/70 mb-1">نام و نام خانوادگی</label>
                     <div className="p-3 bg-background/50 border border-border/50 rounded-lg">{selectedContact.name}</div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-foreground/70 mb-1">ایمیل</label>
                     <div className="p-3 bg-background/50 border border-border/50 rounded-lg">{selectedContact.email}</div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-foreground/70 mb-1">شماره تماس</label>
                     <div className="p-3 bg-background/50 border border-border/50 rounded-lg">{selectedContact.phone}</div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-foreground/70 mb-1">موضوع</label>
                     <div className="p-3 bg-background/50 border border-border/50 rounded-lg">{getSubjectLabel(selectedContact.subject)}</div>
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-foreground/70 mb-1">متن پیام</label>
                     <div className="p-3 bg-background/50 border border-border/50 rounded-lg min-h-32 whitespace-pre-wrap">
                       {selectedContact.description}
                     </div>
                   </div>
                </div>

                <div className="flex items-center justify-between text-sm text-foreground/70">
                  <div>تاریخ ارسال: {new Date(selectedContact.createdAt).toLocaleString('fa-IR')}</div>
                  <div>وضعیت: {getStatusBadge(selectedContact.status)}</div>
                </div>
              </div>
            ) : (
              <div className="border rounded-2xl p-6 bg-background flex items-center justify-center h-64">
                <div className="text-center text-foreground/70">
                  <div className="text-4xl mb-4">📧</div>
                  <div>برای مشاهده جزئیات، یک فرم را انتخاب کنید</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
