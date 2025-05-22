import TextImageCard from "../../Components/cards/TextImageCard";
import Header from "../../Components/Header"
import { sendAxiosRequest } from "../../Utils/sendAxiosRequest";

interface IDepartmentsIndexProps {
  categories: any;
  tags: any;
}

const DepartmentsIndex = ({categories, tags}: IDepartmentsIndexProps) => {
  return (
    <div className="flex flex-col gap-6 w-full bg-white min-h-screen relative">
      <Header />
      <div className="flex flex-col gap-4 mt-6 px-4">
        <h4 className="text-lg font-bold text-slate-700 text-center">All Categories</h4>
        <div className="w-28 h-1 bg-orange-600 rounded-xl mx-auto mb-8" />
        <div className="flex flex-row flex-wrap justify-center gap-4 ">
          {
            categories?.map((category: any, index: number) => (
              <TextImageCard
                key={`${category.id}-${index}`}
                title={category.name}
                image={category.image}
                link={`/results?search=${category.name}`}
              />
            ))
          }
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6 px-4">
        <h4 className="text-lg font-bold text-slate-700 text-center">All Tags</h4>
        <div className="w-28 h-1 bg-orange-600 rounded-xl mx-auto mb-8" />
        <div className="flex flex-row flex-wrap justify-center gap-4 ">
          {
            tags?.map((tag: any, index: number) => (
              <TextImageCard
                key={`${tag.id}-${index}`}
                title={tag.name}
                image={tag.image}
                link={`/results?search=${tag.name}`}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default DepartmentsIndex

export async function getServerSideProps() {
  try{
      const getCategories = await sendAxiosRequest(
        '/api/product/category/index',
        'get',
        {},
        '',
        ''
      );
      const getTags = await sendAxiosRequest(
        '/api/product/tag/index',
        'get',
        {},
        '',
        ''
      );

      const [categoriesResult, tagsResult] = await Promise.allSettled([
        getCategories,
        getTags,
      ]);

      const categories = categoriesResult.status === 'fulfilled' ? categoriesResult?.value?.data : [];
      const tags = tagsResult.status === 'fulfilled' ? tagsResult?.value?.data : [];      
      
      return {
        props: {
          categories: categories ?? [],
          tags: tags ?? [],
        },
      }
  }
  catch(err) {
    console.log({err})
    return {
      props: {
        categories: [],
        tags: [],
      },
    }
  }
}