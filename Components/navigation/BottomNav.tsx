import { useRouter } from 'next/router';
import { Home, Train, Search, ShoppingCart, User } from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Trains', icon: Train, href: '/order-train' },
  { label: 'Search', icon: Search, href: '/results' },
  { label: 'Cart', icon: ShoppingCart, href: '/cart' },
  { label: 'Profile', icon: User, href: '/profile' },
];

const BottomNav = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 flex justify-around items-center py-2 pb-safe z-40 md:hidden">
      {navItems.map(({ label, icon: Icon, href }) => {
        const active = currentPath === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
          >
            <Icon
              className={`w-5 h-5 ${active ? 'text-orange-500' : 'text-slate-400'}`}
              strokeWidth={active ? 2.5 : 1.75}
            />
            <span className={`text-[10px] font-medium ${active ? 'text-orange-500' : 'text-slate-400'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;