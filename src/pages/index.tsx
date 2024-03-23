import { SignInButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import Image from "next/image";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="rounded-full"
        width={64}
        height={64}
      />
      <input
        placeholder="Type Some Emojis..."
        className="w-full grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["post"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex gap-2 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt="Author Profile Image"
        className="rounded-full"
        width={64}
        height={64}
      />
      <div className="flex flex-col gap-2 pb-3">
        <span className="text-slate-400">{`@${author.username} · ${dayjs().to(post.createdAt)}`}</span>
        {post.content}
      </div>
    </div>
  );
};

export default function Home() {
  const user = useUser();
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!!user.isSignedIn && (
              <div className="flex grow justify-center">
                <CreatePostWizard />
              </div>
            )}
            {!user.isSignedIn && <SignInButton />}
          </div>
          <div className="flex flex-col">
            {data?.map((fullPost) => (
              <PostView key={fullPost.post.id} {...fullPost} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
