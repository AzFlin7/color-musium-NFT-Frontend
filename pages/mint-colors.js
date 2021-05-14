import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MintColors from "../components/MintColors/MintColors";

const mintcolors = ({ data }) => {
  const router = useRouter();
  useEffect(() => {
    router.push("/choose");
  }, []);

  return (
    <>
      <Head>
        <title>Mint Concept</title>
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
      <MintColors data={data} />
    </>
  );
};

export default mintcolors;

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
