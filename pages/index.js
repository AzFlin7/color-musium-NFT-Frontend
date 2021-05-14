// import { useRouter } from "next/router";
// import { FullWidthPage, HideHeaderLogo } from "../store/actions/toggle";
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";
// import Homepage from "../components/homepage";
// import Head from "next/head";
// import client from "../client";
// import groq from "groq";

import { useRouter } from "next/router";
import { FullWidthPage, HideHeaderLogo } from "../store/actions/toggle";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Head from "next/head";
import client from "../client";
import groq from "groq";
import getAllColorNFT from "../components/cube/http/fetch/getAllColorNFT";
import NewHomepageDemo from "../components/newhomepagedemo";

export default function Home({ data, posts, colors }) {
  // const router = useRouter();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   router.pathname && dispatch(HideHeaderLogo()) && dispatch(FullWidthPage());
  // }, []);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    router.pathname && dispatch(HideHeaderLogo()) && dispatch(FullWidthPage());
  }, []);

  return (
    <>
      <Head>
        {" "}
        <meta name="title" content="Color NFT by Color Museum" />
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
        <meta
          property="og:image"
          content={"https://color.museum//images/metaHomepage.jpeg"}
        />
        <meta
          property="twitter:image"
          content={"https://color.museum//images/metaHomepage.jpeg"}
        />
      </Head>
      {/* <Homepage Data={data} posts={posts} /> */}
      <NewHomepageDemo
        Data={data && data}
        posts={posts && posts}
        colors={colors}
      />
    </>
  );
}

// export async function getServerSideProps({ res }) {
//   res.setHeader(
//     "Cache-Control",
//     "public, s-maxage=10, stale-while-revalidate=59"
//   );
//   // Fetch data from external API
//   const resp = await fetch("https://metadata.color.museum/api/v1/image/");
//   const data = await resp.json();

//   const posts = await client.fetch(groq`
//       *[_type == "post"]
//     `);

//   // Pass data to the page via props
//   return { props: { data, posts } };
// }

export async function getServerSideProps({ res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  // Fetch data from external API
  const resp = await fetch("https://metadata.color.museum/api/v1/image/");
  const data = await resp.json();

  const posts = await client.fetch(groq`
      *[_type == "post"]
    `);

  const color = await getAllColorNFT();
  const colors = color.documents;

  // Pass data to the page via props
  return { props: { data, posts, colors } };
}
