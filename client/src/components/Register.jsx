import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Please fill all details !", { position: 'top-center' });
      return;
    }
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        displayName: name,
      });
      toast.success("You have been registered successfully", { position: 'top-center' });
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.error || "Registration failed";
      toast.error(msg, { position: 'top-center' });
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <main className="flex-grow flex items-stretch">
        <div className="flex flex-col md:flex-row w-full max-w-container-max mx-auto overflow-hidden">
          <div className="hidden md:flex flex-1 relative items-center justify-center p-xl overflow-hidden bg-primary-container">
            <img
              alt="Financial Growth"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLv2ESdrwnTzPZsFFcOcPlw_LZg1uKnwMtk_IgdojCi4C5Zg0uyDaHDPFRiOeD_p50G2HItTKr8n4XkEn7dWMoIrnBw7Qg5-Yhvun6zrLBD5oaX31GPxhwEdchk_QsAvTL298rtXDq5zriDABHHd5fooIR-5MOlUSHPupIW0N6h0oMvV4kalOtoHhnh2nV0quPODhAXB6StRrOKKDBGuVsOWJdrqPBDSylli2W77CfznxG3RLLh_RfPGV4W5bjviB4zPxlY31n99o"
            />
            <div className="relative z-10 glass-panel p-lg rounded-xl max-w-md">
              <h1 className="font-headline-lg text-headline-lg text-primary mb-md">Empowering your financial growth.</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">Take control of your monthly obligations with the world's most intuitive bill management platform.</p>
              <div className="flex items-center gap-base text-secondary">
                <span className="material-symbols-outlined fill">check_circle</span>
                <span className="font-label-md text-label-md">Automated Tracking</span>
              </div>
              <div className="flex items-center gap-base text-secondary mt-base">
                <span className="material-symbols-outlined fill">check_circle</span>
                <span className="font-label-md text-label-md">Secure Financial Vault</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-gutter bg-surface">
            <div className="w-full max-w-md">
              <div className="mb-xl text-center md:text-left">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Create your account</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Start your journey to financial clarity today.</p>
              </div>

              <form className="space-y-md" onSubmit={handleSubmit}>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant block" htmlFor="full-name">Full Name</label>
                  <input
                    className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest"
                    id="full-name"
                    placeholder="John Doe"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant block" htmlFor="email">Email Address</label>
                  <input
                    className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest"
                    id="email"
                    placeholder="john@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant block" htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest"
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer">visibility</span>
                  </div>
                </div>
                <div className="flex items-start gap-sm pt-xs">
                  <input className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" id="terms" type="checkbox" />
                  <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">
                    I agree to the <a className="text-primary font-semibold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-md bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all duration-200 mt-base"
                >
                  Create Account
                </button>

                <div className="relative flex items-center py-sm">
                  <div className="flex-grow border-t border-outline-variant"></div>
                  <span className="flex-shrink mx-md font-label-sm text-label-sm text-on-surface-variant">OR CONTINUE WITH</span>
                  <div className="flex-grow border-t border-outline-variant"></div>
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <button className="flex items-center justify-center gap-base py-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors" type="button">
                    <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz0OJmL3o3aFGqERFnZ10GggNwrbZpMxwLnu1_UUYncr9Es0N7rLYFJe2-MiW3IJ9gbW7Okv6pdH-vdHRMCrZMNL3Sc2gTUfu10ymJYIGMFMNhHaZ_LvDPz-5wd7Z6-BJsXhozTYr3v1H4w4g5yrCH-LxJI7pKvzChFEHRpU_uwl53hY3XD4yjJJ0H6oJKMw04V30kzvW_solzNTlLqMDTrQFIucKtoHp9gVTVqC-62zm5fClEPA1iY1QcXFTjUzc_84zSwv4Nw1M" />
                    <span className="font-label-md text-label-md">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-base py-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors" type="button">
                    <span className="material-symbols-outlined text-on-surface fill">apps</span>
                    <span className="font-label-md text-label-md">Apple</span>
                  </button>
                </div>

                <div className="text-center pt-md">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter w-full max-w-container-max mx-auto gap-md">
          <div className="flex flex-col items-center md:items-start gap-xs">
            <div className="font-headline-sm text-headline-sm text-primary">Only Bills</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">&copy; 2024 Only Bills. Secure Financial Management.</p>
          </div>
          <div className="flex gap-lg">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Privacy Policy</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Terms of Service</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Security</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors cursor-pointer" href="#">Contact</a>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-gutter right-gutter z-50">
        <button className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-xl hover:scale-105 transition-transform active:scale-95 group">
          <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform fill">smart_toy</span>
        </button>
      </div>
    </div>
  );
}

export default Signup;
