import Head from "next/head";
import React from "react";
import Change from "../../components/Change/Change";
import styles from "../../styles/modules/choose/choose.module.css";

const Id = () => {
  return (
    <>
      <Head>
        <title>Color Museum | Edit Color NFT</title>
        <meta name="description" content="Color Museum: Est. 2022." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={styles.wrapper}>
        <Change />
      </section>
    </>
  );
};

export default Id;

export async function setServerSideProps({ params }) {
  // Fetch data from external API
  const res = await fetch(
    `https://metadata.color.museum/api/v1/image/get-image/${params.id}`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}
