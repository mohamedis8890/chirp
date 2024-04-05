import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

import type { RouterOutputs } from "~/utils/api";
type PostWithUser = RouterOutputs["post"]["getAll"][number];

dayjs.extend(relativeTime);

export const PostView = (props: PostWithUser) => {
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
