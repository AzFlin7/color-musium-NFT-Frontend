import React from "react";
import client from "../../client";
import groq from "groq";
import Head from "next/head";
import BulletinNew from "../../components/bulletin/BulletinNew";

const bulletin = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Color Museum | Comms</title>
        <meta
          name="description"
          content="Own and earn royalties from color on the Ethereum blockchain."
        />
        <meta property="og:title" content="Color NFT by Color Museum" />
        <meta
          property="og:description"
          content="Own and earn royalties from color on the Ethereum blockchain."
        />
        <meta property="twitter:title" content="Color NFT by Color Museum" />
        <meta
          property="twitter:description"
          content="Own and earn royalties from color on the Ethereum blockchain."
        />
      </Head>
      <BulletinNew posts={posts} />
    </>
  );
};

export async function getStaticProps() {
  const posts = await client.fetch(groq`
      *[_type == "post"]
    `);
  return {
    props: {
      posts,
    },
  };
}

export default bulletin;
