import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getLocalStorage, deleteLocalStorage } from '../services/Storage';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

const sidebarLinks = [
  { icon: 'dashboard', label: 'Dashboard', path: '/home' },
  { icon: 'receipt_long', label: 'Transactions', path: '/transactions' },
  { icon: 'query_stats', label: 'Predictor', path: '/elec' },
  { icon: 'account_balance_wallet', label: 'Planner', path: '/plan' },
  { icon: 'call_split', label: 'Splitter', path: '/split' },
  { icon: 'info', label: 'About', path: '/about' },
];

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const stored = getLocalStorage('userDetail');
    setUser(stored);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    deleteLocalStorage();
    navigate('/login');
  };

  const userId = user?.id;

  useEffect(() => {
    if (!userId || !chatOpen) return;
    axios.get(`${API_URL}/api/data/chat/history`, { params: { userId } })
      .then(r => {
        if (r.data.length > 0) {
          setMessages(r.data.map(m => ({
            role: m.role === 'assistant' ? 'model' : m.role,
            content: m.content
          })));
        } else {
          setMessages([{ role: 'user', content: 'From now on, only respond to questions about saving money, budgeting, or financial tips.' }]);
        }
      })
      .catch(() => setMessages([{ role: 'user', content: 'From now on, only respond to questions about saving money, budgeting, or financial tips.' }]));
  }, [userId, chatOpen]);

  const saveMsg = async (role, content) => {
    if (!userId) return;
    try { await axios.post(`${API_URL}/api/data/chat/history`, { userId, role, content }); } catch (e) { console.error(e); }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    const updatedMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(updatedMessages);
    saveMsg('user', userMsg);
    setIsChatLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/chat`, { messages: updatedMessages });
      const botReply = response.data.reply;
      setMessages([...updatedMessages, { role: 'model', content: botReply }]);
      saveMsg('assistant', botReply);
    } catch {
      setMessages([...updatedMessages, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 h-full flex flex-col p-base gap-xs bg-surface-container-low dark:bg-primary-container border-r border-outline-variant dark:border-outline w-64 z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="px-md py-lg">
          <h1 className="text-headline-sm font-headline-sm font-bold text-primary dark:text-inverse-primary">Only Bills</h1>
          <p className="text-label-md font-label-md text-on-primary-container">Financial Clarity</p>
        </div>
        <nav className="flex-1 flex flex-col gap-xs">
          {sidebarLinks.map(({ icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-sm px-md py-base transition-all cursor-pointer active:translate-x-1 rounded-lg ${
                location.pathname === path
                  ? 'text-primary dark:text-on-tertiary-container font-bold bg-surface-container-highest dark:bg-tertiary-container'
                  : 'text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container dark:hover:bg-surface-variant'
              }`}
            >
              <span className={`material-symbols-outlined ${location.pathname === path ? 'fill' : ''}`}>{icon}</span>
              <span className="text-label-md font-label-md">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-md py-base flex items-center gap-sm border-t border-outline-variant pt-md">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-label-md font-label-md text-primary border border-outline-variant">
            {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-label-md font-label-md text-on-surface">{user?.displayName || 'User'}</span>
            <span className="text-label-sm font-label-sm text-outline">Premium Member</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col md:ml-64 min-w-0 min-h-screen">
        <header className="flex justify-between items-center w-full px-gutter h-16 sticky top-0 z-30 bg-surface dark:bg-background border-b border-outline-variant shadow-sm">
          <div className="flex items-center gap-md">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden material-symbols-outlined text-primary cursor-pointer p-1">
              menu
            </button>
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input className="pl-10 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-full text-label-sm md:text-label-md focus:outline-none focus:border-primary w-40 md:w-64 transition-all" placeholder="Search bills or analytics..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <button onClick={() => setIsDark(!isDark)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer active:scale-95 text-primary" title="Toggle theme">
              <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer active:scale-95 text-primary">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer active:scale-95 text-primary">
              <span className="material-symbols-outlined">chat_bubble</span>
            </button>
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-label-md font-label-md text-primary border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
                {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-outline-variant">
                    <p className="text-label-md font-label-md">{user?.displayName || 'User'}</p>
                    <p className="text-label-sm font-label-sm text-outline">{user?.email || ''}</p>
                  </div>
                  <div className="p-1">
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-label-md font-label-md text-error hover:bg-surface-container rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1">
          {children}
        </div>

        <footer className="w-full py-xl px-gutter flex flex-col items-center gap-md bg-surface-dim dark:bg-inverse-surface border-t border-outline-variant">
          <div className="flex flex-wrap justify-center gap-lg">
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80" href="#">Privacy Policy</a>
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80" href="#">Terms of Service</a>
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80" href="#">Help Center</a>
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80" href="#">Contact Us</a>
          </div>
          <div className="flex flex-col items-center gap-xs">
            <span className="text-label-md font-label-md font-bold text-on-surface">Only Bills</span>
            <p className="text-body-sm font-body-sm text-on-surface opacity-80">&copy; 2024 Only Bills. Empowering your financial growth.</p>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-gutter right-gutter z-50 flex flex-col items-end gap-sm">
        {chatOpen && (
          <div className="glass-card w-80 rounded-xl shadow-lg border border-outline-variant overflow-hidden flex flex-col">
            <div className="billy-chat-gradient p-md flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container text-sm fill">smart_toy</span>
                </div>
                <div>
                  <p className="text-on-primary font-bold text-label-md">Billy AI</p>
                  <p className="text-on-primary/60 text-[10px]">Financial Assistant</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-on-primary cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="h-64 p-md overflow-y-auto space-y-md flex flex-col bg-surface-container-lowest">
              {messages.slice(1).map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}>
                    <p className="text-body-sm font-body-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container px-3 py-2 rounded-lg">
                    <p className="text-body-sm font-body-sm">Billy is thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-sm bg-surface-container-lowest border-t border-outline-variant flex items-center">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="Ask Billy..." className="flex-1 bg-transparent border-none text-label-md focus:ring-0 outline-none" />
              <button onClick={sendChatMessage} disabled={isChatLoading || !chatInput.trim()} className="bg-primary text-on-primary p-2 rounded-lg flex items-center justify-center disabled:opacity-50 cursor-pointer">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[28px] fill">smart_toy</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
