import Head from "next/head";
import { PageLayout } from "~/components/layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>
        <div>Singe Post Page</div>
      </PageLayout>
    </>
  );
}
