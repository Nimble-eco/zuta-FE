import React, { useState } from 'react';
import { ShieldCheck, FileText, Cookie, ChevronRight, Info } from 'lucide-react';

// --- Types ---
type TabType = 'privacy' | 'terms' | 'cookies';

interface LegalSection {
  id: string;
  title: string;
  nutshell: string;
  content: React.ReactNode;
}

const LegalCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('terms');

  // --- Shared Components ---
  const Nutshell = ({ text }: { text: string }) => (
    <div className="flex items-start gap-3 p-4 mb-6 bg-orange-50 border border-orange-100 rounded-xl">
      <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
      <p className="text-sm font-medium text-orange-900">
        <span className="uppercase font-bold mr-2 text-xs tracking-wider">In a nutshell:</span>
        {text}
      </p>
    </div>
  );

  const Section = ({ id, title, nutshell, content }: LegalSection) => (
    <section id={id} className="mb-12 scroll-mt-24">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">{title}</h3>
      <Nutshell text={nutshell} />
      <div className="text-slate-600 leading-relaxed space-y-4">
        {content}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      {/* Hero Header */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <h1 className="text-4xl font-extrabold text-white mb-4 text-center lg:text-left">Legal Center</h1>
          <p className="text-slate-400 text-center">
            Everything you need to know about your rights, our responsibilities, and how we keep the Zuta community safe.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* --- Sticky Sidebar --- */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-2">
              <button
                onClick={() => setActiveTab('terms')}
                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold transition-all ${
                  activeTab === 'terms' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={20} /> Terms & Conditions
                </div>
                {activeTab === 'terms' && <ChevronRight size={16} />}
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold transition-all ${
                  activeTab === 'privacy' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} /> Privacy Policy
                </div>
                {activeTab === 'privacy' && <ChevronRight size={16} />}
              </button>

              <button
                onClick={() => setActiveTab('cookies')}
                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold transition-all ${
                  activeTab === 'cookies' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Cookie size={20} /> Cookie Policy
                </div>
                {activeTab === 'cookies' && <ChevronRight size={16} />}
              </button>
            </nav>
          </aside>

          {/* --- Main Content Area --- */}
          <main className="flex-1 min-w-0 bg-white p-8 lg:p-12 rounded-3xl border border-slate-100 shadow-sm">
            
            {activeTab === 'terms' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black text-slate-900 mb-8 pb-4 border-b">Terms & Conditions</h2>
                
                <Section 
                    id="order-train" 
                    title="1. The Order Train Model" 
                    nutshell="Zuta connects buyers to wholesale deals. If a train doesn't fill up, you get a full refund."
                    content={<div>
                        <p>An "Order Train" is successful only when the minimum quantity set by the vendor is met before the deadline. Zuta acts as a facilitator for these collective purchases.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Payments are held in escrow until the train is successful.</li>
                            <li>If a train fails, refunds are processed within 24–48 hours to your Zuta wallet.</li>
                        </ul>
                        </div>}
                />

                <Section 
                    id="returns" 
                    title="2. Returns & Refunds" 
                    nutshell="Wholesale items can only be returned if they are damaged or incorrect."
                   content=<p>Due to the bulk nature of group buying, we can only accept returns for items that are significantly different from the description or arrived damaged.</p>
                />
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black text-slate-900 mb-8 pb-4 border-b">Privacy Policy</h2>
                
                <Section 
                  id="data-collect" 
                  title="1. What We Collect" 
                  nutshell="We collect basic info to ship your orders and improve the app. No weird stuff."
                  content=<p>We collect your name, email, and shipping address. We also track your interests to suggest Order Trains you might actually like.</p>
                />

                <Section 
                  id="data-share" 
                  title="2. Sharing Your Data" 
                  nutshell="We only share info with vendors and drivers so you can get your stuff."
                  content=<p>Logistics partners see your address, and vendors see your order requirements. We never sell your personal data to third-party advertisers.</p>
                />
              </div>
            )}

            {activeTab === 'cookies' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black text-slate-900 mb-8 pb-4 border-b">Cookie Policy</h2>
                
                <Section 
                  id="what-cookies" 
                  title="1. Essential Cookies" 
                  nutshell="These are necessary to keep you logged in and your cart active."
                 content=<p>Zuta uses essential cookies to manage your session. Without these, the "Order Train" mechanics wouldn't function across different pages.</p>
                />
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-slate-100 text-sm text-slate-400">
              Last Updated: May 5, 2026. If you have questions, please contact legal@zuta.com
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LegalCenter;