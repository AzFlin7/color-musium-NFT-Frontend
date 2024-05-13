import Head from "next/head";
import React from "react";
import Collection from "../../components/Collection/index";

const collectionId = () => {
  return (
    <>
      <Head>
        <title>Collection/1</title>
        <meta name="description" content="Color Museum: Est. 2022." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Collection />
    </>
  );
};

export default collectionId;

export async function getStaticPaths() {
  let paths = [{ params: { id: "1" } }];
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // console.log('first', params)
  return { props: {} };
}
