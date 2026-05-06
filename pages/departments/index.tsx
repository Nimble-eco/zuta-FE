import TextImageCard from "../../Components/cards/TextImageCard";
import Header from "../../Components/Header";
import { sendAxiosRequest } from "../../Utils/sendAxiosRequest";

interface IDepartmentsIndexProps {
  categories: any[];
  tags: any[];
}

const DepartmentsIndex = ({ categories, tags }: IDepartmentsIndexProps) => {
  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <Header />

      <main className="flex flex-col gap-16 py-12 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        
        {/* Categories Section */}
        <DepartmentSection 
          title="All Categories" 
          subtitle="Browse by department to find exactly what you need"
          items={categories} 
        />

        {/* Tags Section */}
        <DepartmentSection 
          title="Popular Tags" 
          subtitle="Trending collections and specific interests"
          items={tags} 
        />

      </main>
    </div>
  );
};

const DepartmentSection = ({ title, subtitle, items }: { title: string, subtitle: string, items: any[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col">
      {/* Elegant Header Design */}
      <div className="flex flex-col mb-10 relative">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          {title}
        </h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          {subtitle}
        </p>
        {/* Subtle, refined accent line */}
        <div className="w-12 h-1 bg-orange-500 rounded-full mt-4" />
      </div>

      {/* Structured Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {items.map((item: any, index: number) => (
          <div key={`${item.id}-${index}`} className="transition-transform duration-300 hover:-translate-y-1">
            <TextImageCard
              title={item.name}
              image={item.image}
              link={`/results?search=${item.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsIndex;

export async function getServerSideProps() {
  try {
    const [categoriesResult, tagsResult] = await Promise.allSettled([
      sendAxiosRequest('/api/product/category/index', 'get', {}, '', ''),
      sendAxiosRequest('/api/product/tag/index', 'get', {}, '', ''),
    ]);

    const categories = categoriesResult.status === 'fulfilled' ? categoriesResult?.value?.data : [];
    const tags = tagsResult.status === 'fulfilled' ? tagsResult?.value?.data : [];

    return {
      props: {
        categories: categories ?? [],
        tags: tags ?? [],
      },
    };
  } catch (err) {
    console.error("Error fetching departments:", err);
    return {
      props: { categories: [], tags: [] },
    };
  }
}