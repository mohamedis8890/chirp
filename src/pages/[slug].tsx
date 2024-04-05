import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import SuperJSON from "superjson";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/post-view";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { api } from "~/utils/api";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.post.getPostsByUserId.useQuery({
    userId: props.userId,
  });
  if (isLoading) return <LoadingPage />;

  return (
    <>
      {data?.map((fullPost, index) => <PostView key={index} {...fullPost} />)}
    </>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-[10%] border-b border-slate-400 bg-slate-600">
          <div className="absolute bottom-0 left-0">
            <Image
              src={data.profileImageUrl}
              alt={`${data.username}'s profile image`}
              width={128}
              height={128}
              className="-mb-[64px] ml-4 rounded-full border-4 border-black"
            />
          </div>
        </div>
        <div className="mt-[64px] p-5 text-2xl font-bold">{`@${data.username}`}</div>
        <div className="w-full border-b border-slate-400"></div>
        <ProfileFeed userId={username} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db: db, currentUserId: null },
    transformer: SuperJSON,
  });

  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("Invalid slug");
  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username });

  return {
    props: { trpcState: helpers.dehydrate(), username },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
