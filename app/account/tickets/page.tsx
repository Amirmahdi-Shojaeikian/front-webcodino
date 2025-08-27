"use client";

import { useState, FormEvent, useEffect } from "react";
import { fetchTickets, fetchTicketDetail, createTicket, replyTicket, TicketListItem, TicketMessageItem } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import Notification from "@/components/Notification";

export default function TicketsPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<TicketListItem | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [rows, setRows] = useState<TicketListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State برای نگهداری پیام‌های چت
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'admin';
    timestamp: string;
    fileName?: string;
    senderId?: string | null;
  }>>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchTickets();
        if (alive) setRows(Array.isArray(data?.tickets) ? data.tickets : []);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Helper function to determine message sender
  function mapMessageSender(message: TicketMessageItem, ticket: TicketListItem): 'user' | 'admin' {
    // در API واقعی، sender فقط ID است، نه object
    const senderId = typeof message.sender === 'string' ? message.sender : message.sender?._id;
    const currentUserId = user?.id; // از auth context که _id را به id map کرده
    const ticketCreatorId = typeof ticket?.createdBy === 'string' ? ticket.createdBy : ticket?.createdBy?._id;
    
    console.log('=== USER SIDE - Message Sender Detection ===');
    console.log('Message sender ID:', senderId);
    console.log('Current user ID:', currentUserId);
    console.log('Ticket creator ID:', ticketCreatorId);
    
    // اگر فرستنده پیام همان کاربر جاری است (کاربر عادی)
    if (currentUserId && senderId === currentUserId) {
      console.log('→ Determined as USER (current user)');
      return 'user';
    }
    
    // اگر فرستنده پیام سازنده تیکت است و همان کاربر جاری نیست
    if (ticketCreatorId && senderId === ticketCreatorId && senderId !== currentUserId) {
      console.log('→ Determined as USER (ticket creator)');
      return 'user';
    }
    
    // اگر فرستنده کسی غیر از کاربر جاری است، احتمالا ادمین یا پشتیبان است
    if (currentUserId && senderId !== currentUserId) {
      console.log('→ Determined as ADMIN (support staff)');
      return 'admin';
    }
    
    console.log('→ Default to ADMIN');
    return 'admin';
  }

  async function openTicketDetail(ticket: TicketListItem) {
    setSelected(ticket);
    try {
      const detail = await fetchTicketDetail(ticket._id);
      
      // Map messages with proper sender detection based on user ID
      const mappedMsgs = detail.messages.map((m: TicketMessageItem) => ({
        id: m._id,
        text: m.message,
        sender: mapMessageSender(m, detail.ticket || ticket),
        timestamp: new Date(m.createdAt).toLocaleDateString('fa-IR'),
        senderId: typeof m.sender === 'string' ? m.sender : m.sender?._id
      }));
      
      console.log('USER SIDE - Mapped messages with senders:', mappedMsgs);
      setChatMessages(mappedMsgs);
    } catch (error) {
      console.error('Error fetching ticket detail:', error);
    }
  }

  type AdminMessage = {
    id: string;
    subject: string;
    body: string;
    createdAt: string;
    read: boolean;
  };

  const initialAdminMessages: AdminMessage[] = [
    {
      id: "AM-1001",
      subject: "اطلاعیه مهم درباره نگهداری سرور",
      body:
        "کاربر گرامی، به اطلاع می‌رسد امشب ساعت ۲۳ تا ۲۴ عملیات نگهداری انجام می‌شود و ممکن است اختلالاتی رخ دهد.",
      createdAt: "1403/05/20",
      read: false,
    },
  ];

  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>(initialAdminMessages);

  async function submitNewTicket(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const title = String(formData.get("title") || "").trim();
      const department = String(formData.get("department") || "Technical Support");
      const message = String(formData.get("message") || "").trim();
      if (!title || !message) return;
      await createTicket({ title, department, message, description: "", priority: "medium", attachment: null });
      setShowNew(false);
      const data = await fetchTickets();
      setRows(Array.isArray(data?.tickets) ? data.tickets : []);
      setSuccessMessage("تیکت شما ثبت شد و به‌زودی پاسخ داده می‌شود.");
      // حذف پیام موفقیت بعد از 5 ثانیه
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch {
      // noop
    }
  }

  function markMessageAsRead(id: string) {
    setAdminMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }

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

  async function sendReply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newMessage.trim() || !selected) return;
    
    setIsSending(true);
    try {
      await replyTicket({ ticketId: selected._id, message: newMessage });
      
      // Refresh ticket detail with proper sender detection
      const detail = await fetchTicketDetail(selected._id);
      const mappedMsgs = detail.messages.map((m: TicketMessageItem) => ({
        id: m._id,
        text: m.message,
        sender: mapMessageSender(m, detail.ticket || selected),
        timestamp: new Date(m.createdAt).toLocaleDateString('fa-IR'),
        senderId: typeof m.sender === 'string' ? m.sender : m.sender?._id
      }));
      
      setChatMessages(mappedMsgs);
      setNewMessage("");
      setSelectedFile(null);
      setFileName("");
      setIsSending(false);
      
      // بازگرداندن ارتفاع textarea به اندازه اولیه
      const textarea = document.querySelector('textarea[placeholder="پیام خود را بنویسید..."]') as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = '44px';
      }
      
    } catch (error) {
      console.error("خطا در ارسال پیام:", error);
      setIsSending(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تیکت‌های پشتیبانی</h1>
        <button
          className="rounded-xl bg-blue-600 text-white px-5 py-2 text-base hover:bg-blue-700"
          onClick={() => setShowNew(true)}
        >
          ثبت تیکت
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Notification
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
          autoDismiss={true}
        />
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{rows.length}</div>
          <div className="text-sm text-foreground/70">کل تیکت‌ها</div>
        </div>
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{rows.filter(t => t.status === "open").length}</div>
          <div className="text-sm text-foreground/70">تیکت‌های باز</div>
        </div>
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{rows.filter(t => t.status === "answered").length}</div>
          <div className="text-sm text-foreground/70">پاسخ داده شده</div>
        </div>
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{adminMessages.filter(m => !m.read).length}</div>
          <div className="text-sm text-foreground/70">پیام‌های جدید</div>
        </div>
      </div>

      {adminMessages.length > 0 && (
        <div className="border rounded-2xl p-4 space-y-3 bg-background">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">پیام‌های ارسالی ادمین</h2>
            <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-0.5">
              {adminMessages.filter((m) => !m.read).length} جدید
            </span>
          </div>
          <ul className="space-y-3">
            {adminMessages.map((m) => (
              <li
                key={m.id}
                className={`rounded-xl border p-3 ${m.read ? "opacity-70" : "bg-blue-50/40 border-blue-200"}`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="inline-block size-2 rounded-full bg-blue-600" aria-hidden />}
                    <span className="font-semibold">{m.subject}</span>
                  </div>
                  <span className="text-xs text-foreground/70">{m.createdAt}</span>
                </div>
                <p className="text-sm leading-7">{m.body}</p>
                {!m.read && (
                  <div className="mt-2">
                    <button
                      className="rounded border px-3 py-1 text-sm hover:bg-blue-600 hover:text-white"
                      onClick={() => markMessageAsRead(m.id)}
                    >
                      علامت خوانده شد
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border rounded-xl [direction:ltr] bg-background">
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="[direction:rtl] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-foreground/5 text-foreground/80">
                <tr>
                  <th className="p-3 text-right">کد</th>
                  <th className="p-3 text-right">موضوع</th>
                  <th className="p-3 text-right">تاریخ</th>
                  <th className="p-3 text-right">وضعیت</th>
                  <th className="p-3 text-right">سوال</th>
                  <th className="p-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="p-3 text-center" colSpan={6}>در حال بارگذاری...</td></tr>
                )}
                {!isLoading && rows.map((t) => (
                  <tr key={t._id} className="border-t">
                    <td className="p-3">{t._id.slice(-4)}</td>
                    <td className="p-3">{t.title}</td>
                    <td className="p-3">{new Date(t.createdAt).toLocaleDateString('fa-IR')}</td>
                    <td className="p-3">
                      {t.status === 'open' && 'باز'}
                      {t.status === 'in_progress' && 'در حال بررسی'}
                      {t.status === 'answered' && 'پاسخ داده شده'}
                      {t.status === 'closed' && 'بسته'}
                      {!['open', 'in_progress', 'answered', 'closed'].includes(t.status) && t.status}
                    </td>
                    <td className="p-3 line-clamp-2 max-w-[260px]">-</td>
                    <td className="p-3">
                      <button
                        className="rounded border px-3 py-1 hover:bg-blue-600 hover:text-white"
                        onClick={() => openTicketDetail(t)}
                      >
                        مشاهده پاسخ
                      </button>
                    </td>
                  </tr>
                ))}
                {!isLoading && rows.length === 0 && (
                  <tr><td className="p-3 text-center text-foreground/70" colSpan={6}>تیکتی یافت نشد.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
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
                  <h2 className="text-lg font-bold">تیکت {selected._id}</h2>
                  <p className="text-sm text-foreground/70">{selected.title}</p>
                </div>
              </div>
              <button 
                className="rounded-lg p-2 hover:bg-foreground/10 transition-colors" 
                onClick={() => setSelected(null)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              {/* پیام‌ها از API */}
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className="max-w-[75%]">
                    <div className={`p-3 rounded-2xl shadow-sm ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white dark:bg-gray-800 border'
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
                          {message.sender === 'user' ? 'شما' : 'پشتیبانی وب‌کدینو'}
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
                <div className="flex justify-start">
                  <div className="max-w-[75%]">
                    <div className="bg-blue-500 text-white rounded-2xl p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs opacity-90">در حال تایپ...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-background/50 backdrop-blur-sm rounded-b-2xl">
              <div className="flex items-center justify-between text-sm text-foreground/70 mb-3">
                <span>تاریخ ایجاد: {new Date(selected.createdAt).toLocaleDateString('fa-IR')}</span>
                <span>کد تیکت: {selected._id}</span>
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
                      placeholder="پیام خود را بنویسید..."
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
                    {isSending ? "در حال ارسال..." : "ارسال"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl rounded-2xl border bg-background p-5 shadow-xl [direction:rtl]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">ثبت تیکت جدید</h2>
              <button className="rounded px-3 py-1 border hover:bg-blue-600 hover:text-white" onClick={() => setShowNew(false)}>بستن</button>
            </div>
            <form onSubmit={submitNewTicket} className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm mb-1">تعیین دپارتمان</label>
                <div className="relative">
                  <select
                    required
                    defaultValue=""
                    dir="rtl"
                    name="department"
                    className="block w-full min-w-0 rounded-lg border px-3 py-2 pr-10 bg-transparent text-right appearance-none focus:outline-none focus:border-blue-500 transition-colors"
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setIsDropdownOpen(false)}
                  >
                    <option value="" disabled className="text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                      انتخاب کنید...
                    </option>
                    <option value="Technical Support" className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800">
                      پشتیبانی فنی
                    </option>
                    <option value="Finance" className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800">
                      امور مالی
                    </option>
                    <option value="Sales" className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800">
                      فروش و بازاریابی
                    </option>
                    <option value="Other" className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800">
                      سایر
                    </option>
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">موضوع</label>
                <input 
                  type="text" 
                  required 
                  name="title"
                  className="w-full rounded-lg border px-3 py-2 bg-transparent" 
                  placeholder="موضوع تیکت خود را وارد کنید..."
                />
              </div>
              <div>
                <label className="block text-sm mb-1">متن پیام</label>
                <textarea required name="message" rows={6} className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="پیام خود را بنویسید..." />
              </div>
              <div className="flex justify-end">
                <button className="rounded-xl bg-blue-600 text-white px-5 py-2 text-base hover:bg-blue-700">ارسال تیکت</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}


