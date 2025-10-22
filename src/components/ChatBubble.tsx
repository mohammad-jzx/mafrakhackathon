
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, Copy, Maximize2, Minimize2, Image } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  text: string;
  timestamp?: Date;
  images?: string[];
}

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open) {
        if (e.key === 'Escape' && !input.trim()) {
          setOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, input]);

  // Reset unread count when opening chat
  useEffect(() => {
    if (open) {
      setUnreadCount(0);
    }
  }, [open]);

  // Focus trap for accessibility
  useEffect(() => {
    if (!open || !chatPanelRef.current) return;
    
    const focusableElements = chatPanelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    chatPanelRef.current.addEventListener('keydown', handleTabKey);
    return () => chatPanelRef.current?.removeEventListener('keydown', handleTabKey);
  }, [open]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!input.trim() && attachments.length === 0) return;
    
    // Process attachments
    const imageUrls: string[] = [];
    if (attachments.length > 0) {
      // In a real app, you would upload these files to a server
      // For now, we'll create object URLs for demonstration
      attachments.forEach(file => {
        const url = URL.createObjectURL(file);
        imageUrls.push(url);
      });
    }
    
    const userMsg: Message = { 
      role: 'user', 
      text: input.trim(),
      timestamp: new Date(),
      images: imageUrls.length > 0 ? imageUrls : undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    const payload = { message: input };
    setInput('');
    setAttachments([]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: '⚠️ خطأ: ' + (data?.error || 'API'), timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply || '...', timestamp: new Date() }]);
        if (!open) {
          setUnreadCount(prev => prev + 1);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ حدث خطأ في الاتصال.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files).filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملفات صور فقط');
        return false;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return false;
      }
      
      return true;
    });
    
    if (newFiles.length + attachments.length > 4) {
      alert('يمكنك إرفاق 4 صور كحد أقصى');
      const allowedCount = 4 - attachments.length;
      setAttachments(prev => [...prev, ...newFiles.slice(0, allowedCount)]);
    } else {
      setAttachments(prev => [...prev, ...newFiles]);
    }
    
    // Reset file input
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!e.dataTransfer.files) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      if (!file.type.startsWith('image/')) return false;
      if (file.size > 5 * 1024 * 1024) return false;
      return true;
    });
    
    if (droppedFiles.length + attachments.length > 4) {
      const allowedCount = 4 - attachments.length;
      setAttachments(prev => [...prev, ...droppedFiles.slice(0, allowedCount)]);
    } else {
      setAttachments(prev => [...prev, ...droppedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage('');
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('ar-SA', { hour: '2-digit', minute: '2-digit' }).format(date);
  };

  return (
    <>
      {/* Chat Bubble (FAB) */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed z-[9999] flex items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
        style={{
          bottom: window.innerWidth >= 768 ? '24px' : '20px',
          right: window.innerWidth >= 768 ? '24px' : '16px',
          width: '64px',
          height: '64px',
        }}
        whileHover={{ scale: 1.06, rotate: 1 }}
        whileTap={{ scale: 0.96 }}
        aria-label="تحدث معنا"
        title="تحدث معنا"
      >
        <span className="text-2xl">💬</span>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={chatPanelRef}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed z-[9999] flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg backdrop-blur-md"
            style={{
              bottom: window.innerWidth >= 768 ? '24px' : '8px',
              right: window.innerWidth >= 768 ? '24px' : '8px',
              width: window.innerWidth >= 768 ? '400px' : '92vw',
              height: window.innerWidth >= 768 ? '70vh' : '80vh',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--accent)] p-3 text-[var(--accent-contrast)]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-contrast)] bg-opacity-20">
                  <span className="text-lg">🤖</span>
                </div>
                <h2 id="chat-title" className="font-bold">المساعد الذكي</h2>
                <div className="flex h-2 w-2 items-center">
                  <span className="absolute h-2 w-2 rounded-full bg-green-400"></span>
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded p-1 hover:bg-[var(--accent-contrast)] hover:bg-opacity-20"
                  aria-label="تصغير المحادثة"
                >
                  <Minimize2 size={18} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded p-1 hover:bg-[var(--accent-contrast)] hover:bg-opacity-20"
                  aria-label="إغلاق المحادثة"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              className="flex-1 overflow-y-auto overscroll-contain p-4 text-[var(--text)]"
              role="log"
              aria-live="polite"
            >
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-[var(--muted)]">
                  <div className="mb-4 text-4xl">👋</div>
                  <h3 className="mb-2 text-lg font-bold">مرحباً بك!</h3>
                  <p className="max-w-xs">كيف يمكنني مساعدتك اليوم؟ يمكنك طرح أي سؤال حول الزراعة والمحاصيل.</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isLastMessage = i === messages.length - 1;
                  const isConsecutive = i > 0 && messages[i-1].role === msg.role;
                  
                  return (
                    <motion.div
                      key={i}
                      ref={isLastMessage ? lastMessageRef : null}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} rtl:flex-row-reverse`}
                     >
                       <div 
                         className={`group relative max-w-[75%] rounded-2xl px-4 py-2.5 ${
                           msg.role === 'user' 
                             ? 'bg-[var(--accent)] bg-opacity-10 text-[var(--text)] border border-[var(--accent)] border-opacity-25 rounded-tr-sm rtl:rounded-tr-2xl rtl:rounded-tl-sm' 
                             : 'bg-[var(--card)] bg-opacity-80 border border-[var(--border)] text-[var(--text)] rounded-tl-sm rtl:rounded-tl-2xl rtl:rounded-tr-sm'
                         } ${isConsecutive ? 'mt-1' : 'mt-3'} text-right rtl:text-left`}
                      >
                        {msg.text}
                        
                        {/* Image attachments */}
                         {msg.images && msg.images.length > 0 && (
                           <div className={`mt-2 grid gap-2 ${msg.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                             {msg.images.map((img, imgIndex) => (
                               <motion.div 
                                 key={imgIndex} 
                                 className="relative overflow-hidden rounded-lg"
                                 initial={{ opacity: 0, scale: 0.9 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 transition={{ delay: 0.1 * imgIndex, duration: 0.3 }}
                                 whileHover={{ scale: 1.03 }}
                               >
                                 <img 
                                   src={img} 
                                   alt={`صورة ${imgIndex + 1}`} 
                                   className="h-auto w-full cursor-pointer object-cover"
                                   loading="lazy"
                                   onClick={() => openLightbox(img)}
                                 />
                               </motion.div>
                             ))}
                           </div>
                         )}
                        
                        {/* Message time */}
                        <div className={`mt-1 text-right text-xs text-[var(--muted)]`}>
                          {formatTime(msg.timestamp)}
                        </div>
                        
                        {/* Copy button */}
                        <button
                          onClick={() => copyMessage(msg.text)}
                          className="absolute -top-2 -right-2 hidden rounded-full bg-[var(--card)] p-1 shadow-sm hover:bg-[var(--border)] group-hover:block"
                          aria-label="نسخ الرسالة"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
              
              {/* Loading indicator */}
               {loading && (
                 <motion.div 
                   className="flex justify-start"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.3 }}
                 >
                   <div className="flex max-w-[75%] items-end gap-2 rounded-2xl bg-[var(--card)] bg-opacity-80 border border-[var(--border)] px-4 py-3 text-[var(--text)]">
                     <motion.div 
                       className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]"
                       animate={{ 
                         scale: [1, 1.2, 1],
                         opacity: [0.5, 1, 0.5]
                       }}
                       transition={{ 
                         repeat: Infinity, 
                         duration: 1.5,
                         ease: "easeInOut",
                         times: [0, 0.5, 1]
                       }}
                     />
                     <motion.div 
                       className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]"
                       animate={{ 
                         scale: [1, 1.2, 1],
                         opacity: [0.5, 1, 0.5]
                       }}
                       transition={{ 
                         repeat: Infinity, 
                         duration: 1.5,
                         ease: "easeInOut",
                         delay: 0.2,
                         times: [0, 0.5, 1]
                       }}
                     />
                     <motion.div 
                       className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]"
                       animate={{ 
                         scale: [1, 1.2, 1],
                         opacity: [0.5, 1, 0.5]
                       }}
                       transition={{ 
                         repeat: Infinity, 
                         duration: 1.5,
                         ease: "easeInOut",
                         delay: 0.4,
                         times: [0, 0.5, 1]
                       }}
                     />
                   </div>
                 </motion.div>
               )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <form 
              onSubmit={sendMessage} 
              className="border-t border-[var(--border)] bg-[var(--card)] p-3"
            >
              {/* Attachment previews */}
              {attachments.length > 0 && (
                <div className="mb-2 grid grid-cols-4 gap-2">
                  {attachments.map((file, i) => (
                    <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`مرفق ${i + 1}`} 
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttachment(i)}
                        className="absolute right-0 top-0 rounded-bl-lg bg-red-500 p-1 text-white"
                        aria-label="حذف المرفق"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResizeTextarea();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  rows={1}
                />
                
                <div className="flex gap-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--text)]"
                    aria-label="إرفاق صورة"
                  >
                    <Paperclip size={18} />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || (!input.trim() && attachments.length === 0)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] disabled:opacity-50"
                    aria-label="إرسال"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-[var(--muted)]">
                <span>Enter للإرسال • Shift+Enter لسطر جديد</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for images */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeLightbox}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img 
              src={lightboxImage} 
              alt="صورة موسعة" 
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={closeLightbox}
              className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-black"
              aria-label="إغلاق"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}


