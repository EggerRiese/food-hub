import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { Pill } from "~/components/pill";
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
      <PageLayout>
        <img src={data?.url} className="w-full h-52 object-cover"/>
        <div className="text-4xl font-extrabold pt-4">{data?.name}</div>
        <div className="">Zutaten</div>

        <div className="flex flex-row flex-wrap gap-2 justify-center w-3/4 mt-4 mb-4">
          <Pill name="Paprika"/>
          <Pill name="Paprika"/>
          <Pill name="Paprika"/>
          <Pill name="Paprika"/>
          <Pill name="Paprika"/>
          <Pill name="Paprika"/>
          <Pill name="Paprika"/>
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
