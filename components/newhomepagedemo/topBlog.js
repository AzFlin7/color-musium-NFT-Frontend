import { useEffect, useState } from 'react';
import styles from '../../styles/modules/homepage/topblog.module.css';

const TopBlog = () => {
  const [animation, setAnimation] = useState(1);
  useEffect(() => {
    if (animation === 3) {
      setTimeout(() => {
        if (animation < 3) setAnimation((animation += 1));
        else setAnimation(1);
      }, 5000);
    } else {
      setTimeout(() => {
        if (animation < 3) setAnimation((animation += 1));
        else setAnimation(1);
      }, 3000);
    }
  }, [animation]);

  return (
    <section>
      {animation === 1 ? (
        <a
          className={styles.vice_container}
          target='_blank'
          rel='noreferrer'
          href='https://www.vice.com/en/article/3ab5k8/can-you-own-a-color-a-new-nft-marketplace-is-trying-to-find-out?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum'
        >
          <img src={'/images/logos/VICE.png'} alt='vice logo' />
          <h1>CAN YOU OWN COLORS?</h1>
          <div>Read</div>
        </a>
      ) : animation === 2 ? (
        <a
          className={styles.vice_container}
          target='_blank'
          rel='noreferrer'
          href='https://designtaxi.com/news/417628/NFT-Color-Museum-Claims-You-Can-Own-Hues-Gain-Royalties-From-Them/?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum'
        >
          <img src={'/images/logos/TAXI.png'} alt='taxi logo' />
          <h1>OWN HUES & GAIN ROYALTIES?</h1>
          <div>Read</div>
        </a>
      ) : (
        animation === 3 && (
          <a
            className={styles.vice_container}
            target='_blank'
            rel='noreferrer'
            href='https://www.harpersbazaar.com/culture/art-books-music/a39957975/you-can-now-buy-a-color-via-nft-what-does-this-mean-for-art/'
          >
            <img src={'/images/logos/Bazaar.png'} alt='taxi logo' />
            <h1 className={styles.smallFont}>
              COLOR VIA NFT: WHAT DOES THIS MEAN FOR ART?
            </h1>
            <div>Read</div>
          </a>
        )
      )}
    </section>
  );
};

export default TopBlog;
