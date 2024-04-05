import type { GetStaticPaths, GetStaticProps } from "next";
import type { NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/post-view";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.post.getPostById.useQuery({ id });

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssgHelper = generateSSGHelper();
  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("Invalid id");

  await ssgHelper.post.getPostById.prefetch({ id });

  return {
    props: { trpcState: ssgHelper.dehydrate(), id },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePostPage;
