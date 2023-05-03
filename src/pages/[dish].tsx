import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { generateSSGHelper } from "~/server/helpers/ssgHelpers";
import { api } from "~/utils/api";

const DishPage: NextPage<{id: string}> = ({id}) => {

  const {data} = api.dish.getDishById.useQuery({
    id: id
  })
  
  console.log(data);

  return (
    <>
      <Head>
        <title>Food Hub</title>
        <meta name="description" content="Mmmmmh" />
      </Head>
      <main className="flex items-center flex-col h-screen">

        <div>{data?.name}</div>

      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  debugger;
  const ssg = generateSSGHelper();
  debugger;

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
