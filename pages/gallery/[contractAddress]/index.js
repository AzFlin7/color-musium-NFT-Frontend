import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ContractAddressGallery from "../../../components/contractAddressGallery";

const contractAddress = ({ dataAll }) => {
  const [data, setData] = useState();
  const router = useRouter();

  const handleNextNft = async (nextData) => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": "omarcolormuseu_sk_j2h68noef6sz4lum",
      },
    };
    await axios(nextData, options).then((res) => {
      setData((prevState) => [...prevState, ...res.data.nfts]);
      handleNext(res.data.next);
    });
  };

  const handleNext = (next) => {
    if (next) {
      handleNextNft(next);
    }
  };

  useEffect(() => {
    if (router.query.contractAddress) {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-api-key": "omarcolormuseu_sk_j2h68noef6sz4lum",
        },
      };
      const handleToken = async () => {
        await axios(
          `https://api.simplehash.com/api/v0/nfts/ethereum/${router.query.contractAddress}`,
          options
        ).then((res) => {
          setData(res.data.nfts);
          handleNext(res.data.next);
        });
      };
      handleToken();
    }
  }, [router]);

  return <ContractAddressGallery data={data} dataAll={dataAll.documents} />;
};

export default contractAddress;

export async function getServerSideProps({ res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const resp = await fetch("https://metadata.color.museum/api/v1/image/");
  const dataAll = await resp.json();

  // Pass data to the page via props
  return { props: { dataAll } };
}
