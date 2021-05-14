import Head from "next/head";
import React from "react";
import Earn from "../../components/Earn/Earn";
import Trade from "../../components/Trade/Trade";

const index = ({ data }) => {
  return (
    <>
      <Head>
        <title>Earn</title>
        <meta name="description" content="Color Museum: Est. 2022." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Earn data={data} />
    </>
  );
};

export default index;
