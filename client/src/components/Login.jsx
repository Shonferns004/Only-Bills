import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setLocalStorage } from "../services/Storage";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields!", { position: 'top-center' });
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { user } = res.data;
      setLocalStorage("userDetail", user);
      toast.success("Logged in Successfully", { position: 'top-center' });
      navigate("/home");
    } catch (error) {
      const msg = error.response?.data?.error || "Login failed";
      toast.error(msg, { position: 'top-center' });
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2 relative bg-primary-container overflow-hidden items-center justify-center p-xl">
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              alt="Financial Clarity"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUcq0Sli0BOyh9AFCWL3NlmUwwp3h9fHuYNgUUKwppINpwoT0GyPeKkMy789A5QznKymdwBLqQOqkmVLd28yhx5T9exj6Z4XdqdzhUy5ttpbQswRk0EyZSGJ4W0WyFjiogeE5TJehzYxVsIoAJK7r2qrpEYaKBpedLIvSxcaItRyfNRlgr-QIoiSNlK1Pzy63Z-rHS4kSKBkpk-PN0eXDlCxGpQX0SHbSt6MJTsc9LuMXp-pEmwVEmLbDm1u2skXAAsT0lzz3hc10"
            />
          </div>
          <div className="relative z-10 max-w-md text-center">
            <h2 className="font-headline-lg text-headline-lg text-white mb-md">Master Your Bills with Absolute Clarity.</h2>
            <p className="font-body-lg text-body-lg text-on-primary-container">
              Experience the most intuitive way to manage your financial obligations. Only Bills simplifies the complex, so you can focus on what matters most.
            </p>
            <div className="mt-lg flex justify-center gap-sm">
              <div className="h-1 w-12 bg-secondary-fixed rounded-full"></div>
              <div className="h-1 w-4 bg-outline rounded-full"></div>
              <div className="h-1 w-4 bg-outline rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-gutter lg:p-xl bg-surface">
          <div className="w-full max-w-[440px] space-y-lg">
            <div className="text-center md:text-left">
              <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Only Bills</span>
              <h1 className="font-headline-lg text-headline-lg mt-md">Welcome Back</h1>
              <p className="font-body-md text-on-surface-variant mt-xs">Log in to manage your financial dashboard.</p>
            </div>

            <form className="space-y-md" onSubmit={handleSubmit}>
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant block" htmlFor="email">Email Address</label>
                <input
                  className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md bg-surface-container-lowest"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant block" htmlFor="password">Password</label>
                <input
                  className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md bg-surface-container-lowest"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-sm cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                  <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
                </label>
                <a className="font-body-sm text-body-sm text-secondary font-semibold hover:underline" href="#">Forgot Password?</a>
              </div>
              <button
                type="submit"
                className="w-full py-md bg-primary text-on-primary rounded-lg font-label-md text-label-md uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
              >
                Log In
              </button>
            </form>

            <div className="relative py-base">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-body-sm">
                <span className="bg-surface px-sm text-on-surface-variant">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-md">
              <button className="flex items-center justify-center py-sm border border-outline-variant rounded-lg hover:bg-surface-container transition-colors active:scale-95">
                <img alt="Google" className="w-5 h-5 mr-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWi-bAt64M8PsnH8r5w7qjoTAes5rr3bTgv9_BmCECVqOQoRNt6JT_RHN81LcH_mCKixZzuGfPvw8sIVnxYTVBjnu_lU99xqKAgH9-ya3PS2IRDXkaF3T388QwqlpA7KCChQnDPXqIZU0bQg2KSIHLzAd4kPIku9z_K3tp4bg5xV1ck8a6F7I-YcSiKc7wuLj8WzqsNDGwkIYyPIFYPe_7ve7F9a2_li34pz9BntQ8aM8Y-NjqRbBcOggWAqz4v-4dguJBRPvJiDM" />
                <span className="font-label-md text-label-md">Google</span>
              </button>
              <button className="flex items-center justify-center py-sm border border-outline-variant rounded-lg hover:bg-surface-container transition-colors active:scale-95">
                <span className="material-symbols-outlined mr-sm text-[20px]">apps</span>
                <span className="font-label-md text-label-md">Apple</span>
              </button>
            </div>

            <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/register" className="text-secondary font-semibold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter w-full max-w-container-max mx-auto space-y-md md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-xs">
            <span className="font-headline-sm text-headline-sm text-primary font-bold">Only Bills</span>
            <p className="font-body-sm text-body-sm text-on-surface opacity-70">&copy; 2024 Only Bills. Secure Financial Management.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-md">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Privacy Policy</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Terms of Service</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Security</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Contact</a>
          </nav>
        </div>
      </footer>

      <div className="fixed bottom-gutter right-gutter z-50">
        <button className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[28px] fill">smart_toy</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
