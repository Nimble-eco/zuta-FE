import { MdStar, MdOutlineStarOutline } from 'react-icons/md';

interface IResultsPageSideNavPanelProps {
    filterByRating: (rating: number) => void;
    filterByPrice: (start_price: number, end_price?: number) => void;
}

const ResultsPageSideNavPanel = ({ filterByPrice, filterByRating }: IResultsPageSideNavPanelProps) => {
    const priceRanges = [
        { label: "Under ₦5k", start: 0, end: 5000 },
        { label: "₦5k - ₦10k", start: 5000, end: 10000 },
        { label: "₦10k - ₦20k", start: 10000, end: 20000 },
        { label: "₦20k - ₦50k", start: 20000, end: 50000 },
        { label: "₦50k & Above", start: 50000, end: 10000000 },
    ];

    return (
        <div className="space-y-8">
            <section>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Ratings</h3>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <div 
                            key={rating}
                            onClick={() => filterByRating(rating)}
                            className="flex items-center gap-1 cursor-pointer group hover:bg-slate-50 p-1 rounded-lg transition-colors"
                        >
                            {[...Array(5)].map((_, i) => (
                                i < rating 
                                    ? <MdStar key={i} className="text-orange-400 text-lg" />
                                    : <MdOutlineStarOutline key={i} className="text-slate-300 text-lg" />
                            ))}
                            <span className="text-xs text-slate-500 font-medium ml-1">& up</span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Price Range</h3>
                <div className="grid grid-cols-1 gap-2">
                    {priceRanges.map((range) => (
                        <button 
                            key={range.label}
                            onClick={() => filterByPrice(range.start, range.end)}
                            className="text-left text-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all"
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

ResultsPageSideNavPanel.propTypes = {};

export default ResultsPageSideNavPanel;
