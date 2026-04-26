import { useRouter } from 'next/router';
import { ArrowRight } from 'lucide-react';

const VendorCTABanner = () => {
  const router = useRouter();

  return (
    <div className="mx-4 my-6 flex items-center justify-between bg-slate-800 rounded-2xl px-5 py-4">
      <div>
        <h3 className="text-white font-semibold text-sm mb-0.5">Become a vendor</h3>
        <p className="text-white/50 text-xs">Reach thousands of group buyers</p>
      </div>
      <button
        onClick={() => router.push('/vendorVerification')}
        className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-xs font-semibold px-4 py-2.5 rounded-xl shrink-0"
      >
        Start selling <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default VendorCTABanner;