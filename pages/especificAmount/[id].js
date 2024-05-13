import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Choose from "../../components/Choose/Choose";
import Header from "../../components/Choose/Header";
import styles from "../../styles/modules/choose/choose.module.css";

const id = () => {
  const { query } = useRouter();
  const { id } = query;
  console.log(id);
  useEffect(() => {
    if (id) {
      if (localStorage.clear("EspecificAmount")) return;
      else {
        localStorage.clear("EspecificAmount");
        localStorage.setItem("EspecificAmount", id);
      }
    }
  }, [id]);
  return (
    <>
      <Head>
        <title>Especific Amount</title>
        <meta name="description" content="Color Museum: Est. 2022." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={styles.wrapper}>
        <Header choose={true} />
        <Choose />
      </section>
    </>
  );
};

export default id;
