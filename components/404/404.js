import React from "react";
import styles from "../../styles/modules/error/error.module.css";

const Error = () => {
  return (
    <article className={styles.container}>
      <div className={styles.flex}>
        <div>
          <h3 className={styles.error}>error</h3>
          <h1 className={styles.header}>404.</h1>
        </div>
        <p className={styles.desc}>Requested resource is unavailable.</p>
      </div>
    </article>
  );
};

export default Error;
