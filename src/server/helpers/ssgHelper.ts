import { db } from "~/server/db";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { db: db, currentUserId: null },
    transformer: SuperJSON,
  });
