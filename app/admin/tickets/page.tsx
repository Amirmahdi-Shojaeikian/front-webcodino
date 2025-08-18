"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { fetchTicketsAdmin, fetchTicketDetailAdmin, replyTicket, TicketListItem, TicketMessageItem } from "@/lib/auth";

type AdminTicket = TicketListItem & { userName?: string };
const seedTickets: AdminTicket[] = [];

export default function AdminTicketsPage() {
  const [rows, setRows] = useState<AdminTicket[]>(seedTickets);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("همه");
  const [dateFilter, setDateFilter] = useState<string>("همه");
  const [departmentFilter, setDepartmentFilter] = useState<string>("همه");
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchTicketsAdmin();
        if (alive) setRows(Array.isArray(data?.tickets) ? data.tickets as AdminTicket[] : []);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  
  // State برای نگهداری پیام‌های چت
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'admin';
    timestamp: string;
    fileName?: string;
  }>>([]);
  const [msgForm, setMsgForm] = useState({
    recipientEmail: "",
    recipientAccount: "",
    subject: "",
    body: "",
    sendToEmail: true,
    sendToAccount: true,
  });

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // بررسی اندازه فایل (حداکثر 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم فایل نباید بیشتر از 5 مگابایت باشد");
        return;
      }
      
      // بررسی نوع فایل
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        alert("فقط فایل‌های تصویر، PDF و متن مجاز هستند");
        return;
      }
      
      setSelectedFile(file);
      setFileName(file.name);
    }
  }

  function removeFile() {
    setSelectedFile(null);
    setFileName("");
  }

  async function openChat(ticket: AdminTicket) {
    setSelectedTicket(ticket);
    try {
      const detail = await fetchTicketDetailAdmin(ticket._id);
      const mappedMsgs = detail.messages.map((m: TicketMessageItem) => ({
        id: m._id,
        text: m.message,
        sender: (m.sender?.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
        timestamp: new Date(m.createdAt).toLocaleDateString('fa-IR')
      }));
      setChatMessages(mappedMsgs);
    } catch {}
  }

  async function sendReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;
    
    setIsSending(true);
    try {
      await replyTicket({ ticketId: selectedTicket._id, message: newMessage });
      const detail = await fetchTicketDetailAdmin(selectedTicket._id);
      const mappedMsgs = detail.messages.map((m: TicketMessageItem) => ({
        id: m._id,
        text: m.message,
        sender: (m.sender?.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
        timestamp: new Date(m.createdAt).toLocaleDateString('fa-IR')
      }));
      setChatMessages(mappedMsgs);
      setNewMessage("");
      setSelectedFile(null);
      setFileName("");
      setIsSending(false);
      const textarea = document.querySelector('textarea[placeholder="پاسخ خود را بنویسید..."]') as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = '44px';
      }
    } catch (error) {
      console.error("خطا در ارسال پیام:", error);
      setIsSending(false);
    }
  }

  function submitMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { recipientEmail, recipientAccount, subject, body, sendToEmail, sendToAccount } = msgForm;
    if (!sendToEmail && !sendToAccount) {
      if (typeof window !== "undefined") alert("حداقل یکی از گزینه‌های ارسال (ایمیل/حساب کاربری) را انتخاب کنید.");
      return;
    }
    if (sendToEmail && !recipientEmail.trim()) {
      if (typeof window !== "undefined") alert("ایمیل کاربر را وارد کنید.");
      return;
    }
    if (sendToAccount && !recipientAccount.trim()) {
      if (typeof window !== "undefined") alert("شناسه حساب کاربری را وارد کنید.");
      return;
    }
    if (!subject.trim() || !body.trim()) {
      if (typeof window !== "undefined") alert("عنوان و متن پیام الزامی است.");
      return;
    }
    if (typeof window !== "undefined") alert("پیام ارسال شد (شبیه‌سازی).");
    setShowMessage(false);
    setMsgForm({ recipientEmail: "", recipientAccount: "", subject: "", body: "", sendToEmail: true, sendToAccount: true });
  }

  // فیلتر کردن تیکت‌ها
  const filteredTickets = useMemo(() => {
    return rows.filter((ticket) => {
      const matchesSearch = 
        ticket._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.createdBy?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "همه" || ticket.status === statusFilter;
      const matchesDepartment = departmentFilter === "همه" || ticket.department === departmentFilter;
      
      // فیلتر تاریخ بهبود یافته
      let matchesDate = true;
      if (dateFilter !== "همه") {
        const ticketDate = new Date(ticket.createdAt);
        const [year, month] = dateFilter.split('/');
        if (month) {
          matchesDate = ticketDate.getFullYear().toString() === year && (ticketDate.getMonth() + 1).toString().padStart(2, '0') === month;
        } else {
          matchesDate = ticketDate.getFullYear().toString() === year;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDepartment && matchesDate;
    });
  }, [rows, searchTerm, statusFilter, departmentFilter, dateFilter]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">مدیریت تیکت‌ها</h1>
        <button
          className="rounded-xl bg-primary text-white px-4 py-2 text-sm hover:bg-primary-light"
          onClick={() => setShowMessage(true)}
        >
          پیام به کاربر
        </button>
      </div>

      {/* فیلترها و جستجو */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm mb-1">جستجو</label>
          <input
            type="text"
            placeholder="جستجو در کد، موضوع، نام کاربر یا سوال..."
            className="w-full rounded-lg border px-3 py-2 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">وضعیت</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-background [&>option]:bg-black [&>option]:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="همه">همه</option>
            <option value="answered">پاسخ داده شد</option>
            <option value="open">در انتظار پاسخ</option>
            <option value="in_progress">در حال پیگیری</option>
            <option value="closed">بسته شده</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">تاریخ</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-background [&>option]:bg-black [&>option]:text-white"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="همه">همه</option>
            <option value="1403/05">خرداد 1403</option>
            <option value="1403/04">اردیبهشت 1403</option>
            <option value="1403/03">فروردین 1403</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">دپارتمان</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-background [&>option]:bg黑 [&>option]:text-white"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="همه">همه</option>
            <option value="Technical Support">پشتیبانی فنی</option>
            <option value="Finance">امور مالی</option>
            <option value="Sales">فروش و بازاریابی</option>
            <option value="Other">سایر</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("همه");
              setDateFilter("همه");
              setDepartmentFilter("همه");
            }}
            className="w-full rounded-lg border px-3 py-2 bg-background hover:bg-primary hover:text-white"
          >
            پاک کردن فیلترها
          </button>
        </div>
      </div>
      <div className="border rounded-xl [direction:ltr] bg-background">
        <div className="max-h-[60vh] overflow-y-auto pr-2 [scrollbar-gutter:stable]">
          <div className="[direction:rtl] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-primary/10 text-foreground/80">
                <tr>
                  <th className="p-3 text-right">کد</th>
                  <th className="p-3 text-right">موضوع</th>
                  <th className="p-3 text-right">نام کاربر</th>
                  <th className="p-3 text-right">دپارتمان</th>
                  <th className="p-3 text-right">تاریخ</th>
                  <th className="p-3 text-right">وضعیت</th>
                  <th className="p-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="p-3 text-center" colSpan={7}>در حال بارگذاری...</td></tr>
                )}
                {!isLoading && filteredTickets.map((t) => (
                  <tr key={t._id} className="border-t">
                    <td className="p-3">{t._id.slice(-4)}</td>
                    <td className="p-3">{t.title}</td>
                    <td className="p-3">{t.createdBy?.name || '-'}</td>
                    <td className="p-3">
                      {t.department === 'Technical Support' && 'پشتیبانی فنی'}
                      {t.department === 'Finance' && 'امور مالی'}
                      {t.department === 'Sales' && 'فروش و بازاریابی'}
                      {t.department === 'Other' && 'سایر'}
                      {!['Technical Support', 'Finance', 'Sales', 'Other'].includes(t.department) && t.department}
                    </td>
                    <td className="p-3">{new Date(t.createdAt).toLocaleDateString('fa-IR')}</td>
                    <td className="p-3">
                      {t.status === 'open' && 'باز'}
                      {t.status === 'in_progress' && 'در حال بررسی'}
                      {t.status === 'answered' && 'پاسخ داده شده'}
                      {t.status === 'closed' && 'بسته'}
                      {!['open', 'in_progress', 'answered', 'closed'].includes(t.status) && t.status}
                    </td>
                    <td className="p-3">
                      <button
                        className="rounded border px-3 py-1 bg-background hover:bg-primary hover:text-white"
                        onClick={() => openChat(t)}
                      >
                        پاسخ
                      </button>
                    </td>
                  </tr>
                ))}
                {!isLoading && filteredTickets.length === 0 && (
                  <tr><td className="p-3 text-center text-foreground/70" colSpan={7}>
                    {rows.length === 0 ? "تیکتی یافت نشد." : "نتیجه‌ای برای فیلترهای انتخابی یافت نشد."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-4xl h-[80vh] rounded-2xl border bg-background shadow-xl [direction:rtl] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-sm rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold">تیکت {selectedTicket._id}</h2>
                  <p className="text-sm text-foreground/70">{selectedTicket.title}</p>
                </div>
              </div>
              <button 
                className="rounded-lg p-2 hover:bg-foreground/10 transition-colors" 
                onClick={() => setSelectedTicket(null)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              {/* Chat Messages */}
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className="max-w-[75%]">
                    <div className={`p-3 rounded-2xl shadow-sm ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white rounded-bl-md' 
                        : 'bg-white dark:bg-gray-800 border rounded-br-md'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {message.sender === 'user' ? (
                          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                          </div>
                        )}
                        <span className="text-xs opacity-90">
                          {message.sender === 'user' ? (selectedTicket.createdBy?.name || 'کاربر') : 'پشتیبانی وب‌کدینو'}
                        </span>
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                      </div>
                      <p className={`text-sm leading-5 whitespace-pre-wrap ${
                        message.sender === 'user' 
                          ? 'text-white' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {message.text}
                      </p>
                      {message.fileName && (
                        <div className="mt-2 flex items-center gap-2 p-2 bg-white/10 dark:bg-gray-700/50 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-xs truncate">{message.fileName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isSending && (
                <div className="flex justify-end">
                  <div className="max-w-[75%]">
                    <div className="bg-white dark:bg-gray-800 border rounded-2xl rounded-br-md p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-gray-500">در حال تایپ...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-background/50 backdrop-blur-sm rounded-b-2xl">
              <div className="flex items-center justify-between text-sm text-foreground/70 mb-3">
                <span>تاریخ ایجاد: {new Date(selectedTicket.createdAt).toLocaleDateString('fa-IR')}</span>
                <span>کد تیکت: {selectedTicket._id}</span>
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {selectedTicket.department}
                </span>
              </div>
              
              {/* Reply Form */}
              <form onSubmit={sendReply} className="space-y-3">
                {/* نمایش فایل انتخاب شده */}
                {selectedFile && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm text-blue-600 flex-1 truncate">{fileName}</span>
                    <button 
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                    >
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <textarea 
                      rows={1}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="پاسخ خود را بنویسید..."
                      className="w-full rounded-xl border px-4 py-3 pr-12 bg-background resize-none focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                      }}
                      disabled={isSending}
                    />
                    <label className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer">
                      <input 
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.txt"
                        disabled={isSending}
                      />
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </label>
                  </div>
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                    {isSending ? "در حال ارسال..." : "ارسال پاسخ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showMessage && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl rounded-2xl border bg-background p-5 shadow-xl [direction:rtl]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">ارسال پیام به کاربر</h2>
              <button className="rounded px-3 py-1 border hover:bg-blue-600 hover:text-white" onClick={() => setShowMessage(false)}>بستن</button>
            </div>
            <form onSubmit={submitMessage} className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">ایمیل کاربر</label>
                  <input
                    type="email"
                    className="w-full rounded border px-3 py-2 ltr:text-left"
                    value={msgForm.recipientEmail}
                    onChange={(e) => setMsgForm((f) => ({ ...f, recipientEmail: e.target.value }))}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">شناسه حساب کاربری</label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    value={msgForm.recipientAccount}
                    onChange={(e) => setMsgForm((f) => ({ ...f, recipientAccount: e.target.value }))}
                    placeholder="مثلاً user-123"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="size-4 accent-blue-600"
                    checked={msgForm.sendToEmail}
                    onChange={(e) => setMsgForm((f) => ({ ...f, sendToEmail: e.target.checked }))}
                  />
                  <span>ارسال به ایمیل</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="size-4 accent-blue-600"
                    checked={msgForm.sendToAccount}
                    onChange={(e) => setMsgForm((f) => ({ ...f, sendToAccount: e.target.checked }))}
                  />
                  <span>ارسال به حساب کاربری</span>
                </label>
              </div>
              <div>
                <label className="block text-sm mb-1">عنوان پیام</label>
                <input
                  className="w-full rounded border px-3 py-2"
                  value={msgForm.subject}
                  onChange={(e) => setMsgForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="عنوان"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">متن پیام</label>
                <textarea
                  rows={6}
                  className="w-full rounded border px-3 py-2"
                  value={msgForm.body}
                  onChange={(e) => setMsgForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder="متن پیام..."
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button type="button" className="rounded border px-4 py-2 hover:bg-blue-600 hover:text-white" onClick={() => setShowMessage(false)}>انصراف</button>
                <button type="submit" className="rounded bg-blue-600 text-white px-5 py-2 hover:bg-blue-700">ارسال پیام</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}


