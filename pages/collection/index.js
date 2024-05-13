import Head from "next/head";
import React from "react";
import Collection from "../../components/Collection/index";

const index = () => {
  return (
    <>
      <Head>
        <title>Collection</title>
        <meta name="description" content="Color Museum: Est. 2022." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Collection />
    </>
  );
};

export default index;
