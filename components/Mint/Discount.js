import React, { useState } from 'react';
import SlideCreateAndLoginAccount from '../newTokenID/SideCreateAndLoginAccount';
import styles from '../../styles/modules/mint/mint.module.css';

const Discount = () => {
  const [createAndLoginAccount, setCreateAndLoginAccount] = useState(false);
  return (
    <>
      <button
        className={styles.disconnectButton}
        onClick={() => setCreateAndLoginAccount(true)}
      >
        Unlock Discount
      </button>
      <SlideCreateAndLoginAccount
        createAndLoginAccount={createAndLoginAccount}
        setCreateAndLoginAccount={setCreateAndLoginAccount}
      />
    </>
  );
};

export default Discount;
