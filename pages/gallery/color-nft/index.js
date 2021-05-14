import Head from "next/head";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Gallery from "../../../components/gallery/index";
import { ReceivedData } from "../../../store/actions/data";

const index = ({ data }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ReceivedData(data.documents));
  }, [data]);

  return (
    <>
      <Head>
        <title>Color Museum | Trade Color NFT Collection</title>
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
  const resp = await fetch(`https://metadata.color.museum/api/v1/image/`);
  const data = await resp.json();

  // Pass data to the page via props
  return { props: { data } };
}
