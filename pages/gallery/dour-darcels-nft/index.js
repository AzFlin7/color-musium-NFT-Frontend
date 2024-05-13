import Head from "next/head";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Gallery from "../../../components/gallery/ThirdParty";
import { ReceivedData } from "../../../store/actions/data";

const index = ({ data }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ReceivedData(data.nfts));
  }, [data]);

  return (
    <>
      <Head>
        <title>Gallery</title>
        <meta name="description" content="Color Museum: Est. 2022." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Gallery data={data} />
    </>
  );
};

export default index;

export async function getServerSideProps({ res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  // Fetch data from external API
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-key": "omarcolormuseu_sk_j2h68noef6sz4lum",
    },
  };

  const resp = await fetch(
    `https://api.simplehash.com/api/v0/nfts/ethereum/0x8d609bd201beaea7dccbfbd9c22851e23da68691`,
    options
  );
  const data = await resp.json();
  return { props: { data } };
}
