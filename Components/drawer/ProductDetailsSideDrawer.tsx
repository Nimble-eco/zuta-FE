import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface IProductDetailsSideDrawerProps {
  title: string;
  description: string;
  introduction?: string;
  visibilityState?: string;
}

const ProductDetailsSideDrawer = (
  { title, introduction, description, visibilityState = 'closed' }: IProductDetailsSideDrawerProps,
  ref: any
) => {
  const [visibility, setVisibility] = React.useState(visibilityState);

  React.useImperativeHandle(ref, () => ({
    open: () => openModal(),
    close: () => closeModal(),
  }));

  function closeModal() {
    setVisibility('closed');
  }

  function openModal() {
    setVisibility('open');
  }

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (visibility === 'open') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visibility]);

  const isOpen = visibility === 'open';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl
          w-full sm:w-[480px] lg:w-[560px]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <p className="text-xs font-medium text-orange-500 uppercase tracking-wider mb-0.5">
              Product details
            </p>
            <h2 className="text-base font-semibold text-slate-800 leading-tight line-clamp-1 capitalize">
              {title}
            </h2>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close drawer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-800 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {introduction && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-4">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">
                Introduction
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{introduction}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Full description
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: description }}
              className="prose prose-sm max-w-none text-slate-600 leading-relaxed
                prose-headings:text-slate-800 prose-headings:font-semibold
                prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-700 prose-li:text-slate-600"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0">
          <button
            onClick={closeModal}
            className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
};

export default React.forwardRef(ProductDetailsSideDrawer);