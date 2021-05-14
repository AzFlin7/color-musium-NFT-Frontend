import Scene from "../components/cube/Scene";
import getAllColorNFT from "../components/cube/http/fetch/getAllColorNFT";


const Home = ({
  colors
}) => {
  return <Scene colors={colors}/>;
};

export async function getStaticProps() {
  const res = await getAllColorNFT();
  return {
    props: {
      colors: res.documents,
    },
  };
}
export default Home;
