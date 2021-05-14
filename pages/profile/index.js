import Head from "next/head";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Profile from "../../components/Profile/Profile";

const index = ({ data }) => {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, []);

  return (
    <>
      <Head>
        <title>Color Museum | Profile</title>
        <meta name="description" content="Color Museum: Est. 2022." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Profile data={data} />
    </>
  );
};

export default index;
