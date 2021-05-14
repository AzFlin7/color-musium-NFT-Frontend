import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TokenIDComponent from "../../../components/newTokenID/TokenId";

const TokenID = ({ data }) => {
  const router = useRouter();
  const [number, setNumber] = useState(data.nftNo);
  const [name, setName] = useState(data.name);
  const [color, setColor] = useState(String(data.hex).toUpperCase());
  const [description, setDescription] = useState(
    data.description || "Description"
  );
  const [loginOpen, setLoginOpen] = useState(false);
  const [image, setImage] = useState(data.image);
  const toggleLogin = () => {
    return setLoginOpen(!loginOpen);
  };
  const [buyItNow, setBuyItNow] = useState(false);

  useEffect(() => {
    if (router.query.buy) {
      setBuyItNow(true);
    }
  }, []);
  return (
    <>
      <Head>
        <title>{`Color NFT No. ${number} | ${name} | ${color}`}</title>
        <meta
          name="title"
          content={`Color NFT No. ${number} | ${name} | ${color}`}
        />
        <meta name="description" content={description} />
        <meta property="og:image" content={image} />
        <meta
          property="og:title"
          content={`Color NFT No. ${number} | ${name} | ${color}`}
        />
        <meta property="og:description" content={description} />
        <meta
          property="twitter:title"
          content={`Color NFT No. ${number} | ${name} | ${color}`}
        />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image} />
      </Head>
      <TokenIDComponent data={data} buyItNow={buyItNow} />
    </>
  );
};

export default TokenID;

export async function getServerSideProps({ res, params }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const resp = await fetch(
    `https://metadata.color.museum/api/v1/image/get-image/${params.token}`
  );
  const data = await resp.json();

  // Pass data to the page via props
  return { props: { data } };
}
