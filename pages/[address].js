import Head from "next/head";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { FullWidthPage, HideHeaderLogo } from "../store/actions/toggle";
import { useDispatch } from "react-redux";
import ProfileSpecificAddress from "../components/Profile/ProfileSpecificAddress";

const index = ({ data }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (router.asPath === "/change") {
      router.push("/");
    }
    router.pathname && dispatch(HideHeaderLogo()) && dispatch(FullWidthPage());
  }, []);

  return (
    <>
      <Head>
        <title>Profile </title>
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
      <ProfileSpecificAddress data={data} />
    </>
  );
};

export default index;

export async function getServerSideProps({ params }) {
  // Fetch data from external API
  const res = await fetch("https://metadata.color.museum/api/v1/image/");
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}
