import Head from "next/head";
import React from "react";
import Trade from "../../components/Trade/Trade";

const index = ({ data }) => {
  return (
    <>
      <Head>
        <title>trade</title>
        <meta name="description" content="Color Museum: Est. 2022." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Trade data={data} />
    </>
  );
};

export default index;
