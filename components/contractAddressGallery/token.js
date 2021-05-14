import styles from '../../styles/modules/newTokenID/tokenID.module.css';
import stylesSale from '../../styles/modules/gallery/sale.module.css';

const token = ({ data }) => {
  console.log(data);
  return (
    <>
      <section className={styles.upperContainer}>
        <div
          className={styles.recentlyContainer}
          style={{
            borderColor: '#292929',
          }}
        >
          <div
            className={styles.containerContent}
            style={{
              borderColor: '#292929',
              textDecoration: 'none',
              display: 'block',
            }}
          >
            <img
              src={data && data.previews.image_medium_url}
              className={styles.imageContainer}
            />
            <div
              className={`${styles.bottomContent} recentlyHeader`}
              style={{ borderBottom: '1px solid #292929' }}
            >
              <div className='recentlyP'>{data && data.name}</div>
              <div
                className='recentlyP margin_right'
                style={{
                  textTransform: 'uppercase',
                  color: '#fff',
                }}
              >
                #{data && data.token_id.slice(0, 6)}
                {data && data.token_id.length > 6 && '...'}
              </div>
            </div>

            <div className={stylesSale.bottomPart}>
              <div className={stylesSale.colorDetails}>
                <h4
                  style={{
                    color: '#FFF',
                    margin: '0',
                    fontWeight: '300',
                  }}
                >
                  Last Price
                </h4>
                <div className={stylesSale.flexContainerBottom}>
                  <div className={stylesSale.ethSection}>
                    <h1>0.00 ETH</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.lowerContainer}>
        <article
          className={styles.lowerLeftContainer}
          style={{ minHeight: '30vh' }}
        >
          <div className={styles.allText}>
            <h1
              style={{
                marginBottom: data && data.name.length > 14 ? '1rem' : '0',
                fontSize: data && data.name.length > 14 ? '2.5rem' : '3rem',
              }}
            >
              {data && data.name}
            </h1>
            <h3>Token ID</h3>
            <h2>{data && data.token_id}</h2>
          </div>
        </article>
      </section>
    </>
  );
};

export default token;
