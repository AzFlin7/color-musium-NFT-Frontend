import Head from "next/head";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { FullWidthPage, HideHeaderLogo } from "../../store/actions/toggle";
import { useDispatch } from "react-redux";
import ProfileSpecificAddress from "../../components/Profile/ProfileSpecificAddress";

const index = ({ data }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    router.pathname && dispatch(HideHeaderLogo()) && dispatch(FullWidthPage());
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content="Color Museum: Est. 2022." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProfileSpecificAddress data={data} />
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
  const resp = await fetch(`https://metadata.color.museum/api/v1/image/`);
  const data = await resp.json();

  // Pass data to the page via props
  return { props: { data } };
}
