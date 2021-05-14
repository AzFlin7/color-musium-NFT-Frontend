import Head from "next/head";
import SeedMintRegistration from "../components/SeedMintRegistration/SeedMintRegistration";


const seedMintRegistration = () => {
    return (
        <>
            <Head>
                <title>Color Museum | Seed Mint Registration</title>
                <meta
                    name='description'
                    content='Own and earn royalties from color on the Ethereum blockchain.'
                />
                <meta property='og:title' content='Color NFT by Color Museum' />
                <meta
                    property='og:description'
                    content='Own and earn royalties from color on the Ethereum blockchain.'
                />
                <meta property='twitter:title' content='Color NFT by Color Museum' />
                <meta
                    property='twitter:description'
                    content='Own and earn royalties from color on the Ethereum blockchain.'
                />
            </Head>
            <SeedMintRegistration />
        </>
    );
};

export default seedMintRegistration;
