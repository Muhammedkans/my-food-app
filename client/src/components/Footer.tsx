import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const Footer = () => {

  return (
    <footer className="bg-dark-900 pt-24 pb-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-black text-xl">F</span>
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-tight">FoodBey</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
              Elevating the art of food delivery. Experience culinary perfection delivered with white-glove precision and AI-powered logistics.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-dark-900 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Team', 'Blog', 'Press'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Stay Updated</h4>
            <p className="text-gray-400 text-sm">Subscribe to our newsletter for exclusive offers and gourmet updates.</p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-dark-900 hover:scale-105 transition-transform">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-xs font-medium">© 2025 FoodBey Technologies. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Download App</span>
            <div className="flex gap-4">
              <button className="h-10 px-4 rounded-xl chat-bg border border-white/10 flex items-center gap-2 text-white hover:border-primary/50 transition-colors">
                <span className="text-[10px] font-bold">App Store</span>
              </button>
              <button className="h-10 px-4 rounded-xl chat-bg border border-white/10 flex items-center gap-2 text-white hover:border-primary/50 transition-colors">
                <span className="text-[10px] font-bold">Google Play</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
