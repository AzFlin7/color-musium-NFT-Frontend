import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Token from '../../../../components/contractAddressGallery/token';

const index = () => {
  const router = useRouter();
  const [data, setData] = useState();
  useEffect(() => {
    if (router.query.contractAddress) {
      const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'x-api-key': 'omarcolormuseu_sk_j2h68noef6sz4lum',
        },
      };
      const handleToken = async () => {
        await axios(
          `https://api.simplehash.com/api/v0/nfts/ethereum/${router.query.contractAddress}/${router.query.token}`,
          options
        ).then((res) => {
          setData(res.data);
        });
      };
      handleToken();
    }
  }, [router]);
  return <Token data={data} />;
};

export default index;
