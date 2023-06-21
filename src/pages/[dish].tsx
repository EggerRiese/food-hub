import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { PageLayout } from "~/components/layout";
import { Pill } from "~/components/pill";
import { generateSSGHelper } from "~/server/helpers/ssgHelpers";
import { api } from "~/utils/api";

const DishPage: NextPage<{id: string}> = ({id}) => {

  const {data, isLoading} = api.dish.getDishById.useQuery({
    id: id
  })


  return (
    <>
      <Head>
        <title>Food Hub</title>
        <meta name="description" content="Mmmmmh" />
      </Head>
      
      <PageLayout>
        <div className="w-full h-52 relative rounded-t-lg overflow-hidden">
          <Image src={data?.url ? data.url : "/placeholder_dish.jpg"} fill sizes="100vw" style={{objectFit: "cover"}} placeholder="blur" blurDataURL={"/lasagna.jpeg"} alt={data?.name ? data.name : "placeholder image"}/>
        </div>
        <div className="text-4xl font-extrabold pt-4">{data?.name}</div>
        <div className="">Ingridients</div>
        <div className="flex flex-row flex-wrap gap-2 justify-center w-11/12 mt-4 mb-4">
          {data?.ingridients.map((ingridient) => (
            <Pill key={ingridient.id} name={ingridient.name} onClick={() => alert(ingridient.name)}/>
          ))}
        </div>
      </PageLayout>
      
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.dish;

  if (typeof id !== "string") {
    throw new Error("no dish id");
  }

  await ssg.dish.getDishById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default DishPage;
