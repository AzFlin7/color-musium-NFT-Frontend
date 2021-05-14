import Head from "next/head";
import Rugfools from "../../components/Rugfools/Rugfools";

const index = () => {

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
      </Head>
      <Rugfools />
    </>
  );
};

export default index; 