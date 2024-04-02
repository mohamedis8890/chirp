import { SignInButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { LoadingPage, LoadingSpinner } from "~/components/loading";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");

  if (!user) return null;

  const ctx = api.useContext();

  const { mutate, isPending: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.post.invalidate();
    },
    onError: (err) => {
      const message = err.data?.zodError?.fieldErrors.content;
      if (message?.[0]) toast.error(message[0]);
      else toast.error("Unable to post now, please try agian later");
    },
  });

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
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (input !== "") mutate({ content: input });
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })} disabled={isPosting}>
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs["post"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  const handle = `@${author.username}`;

  return (
    <div className="flex gap-2 border-b border-slate-400 p-4">
      <div>
        <Image
          src={author.profileImageUrl}
          alt="Author Profile Image"
          className="rounded-full"
          width={64}
          height={64}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex gap-2 pb-2 text-slate-400">
          <Link href={`/${handle}`}>
            <span>{`${handle}`}</span> ·
          </Link>
          <Link href={`/post/${post.id}`}>
            <span>{`${dayjs().to(post.createdAt)}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading } = api.post.getAll.useQuery();
  if (isLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div />;

  return (
    <>
      <PageLayout>
        <div className="flex border-b border-slate-400 p-4">
          {!!isSignedIn && (
            <div className="flex grow justify-center">
              <CreatePostWizard />
            </div>
          )}
          {!isSignedIn && <SignInButton />}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
}
