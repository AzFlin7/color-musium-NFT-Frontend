import Gleap from 'gleap';
import Link from 'next/link';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FooterOnView } from '../../store/actions/toggle';
import styles from '../../styles/modules/footer.module.css';
import useIntersection from '../Earn/useIntersection';
import { SiDiscord } from 'react-icons/si';
import { AiFillTwitterCircle } from 'react-icons/ai';
import { FiMail } from 'react-icons/fi';

const Footer = (props) => {
  const [animation, setAnimation] = useState(true);
  useEffect(() => {
    setAnimation(false);
    const timeout = setTimeout(() => {
      setAnimation(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation(false);
      const timeout = setTimeout(() => {
        setAnimation(true);
      }, 3000);
      return () => clearTimeout(timeout);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const [show, setShow] = useState(true);
  useEffect(() => {
    if (
      window.location.pathname === '/mint-pending' ||
      window.location.pathname === '/mint-success' ||
      window.location.pathname === '/mint-failed' ||
      window.location.pathname.slice(0, 16) === '/especificAmount'
    ) {
      setShow(false);
    } else setShow(true);
  }, []);

  const { fullWidthPage } = useSelector((state) => state.toggle);
  const refFooter = useRef();
  const footerRef = useIntersection(refFooter, '0px');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FooterOnView(footerRef));
  }, [footerRef]);

  return (
    <div ref={refFooter}>
      {show && (
        <footer
          className={`${fullWidthPage ? styles.footer : styles.footer} 
          ${props.topPart ? styles.inToppart : null}`}
        >
          <>
            <div className={styles.desktop_footer}>
              <div className={styles.flex_container}>
                <div className={styles.container_footer}>
                  <div>
                    <div>
                      <h4>© Color Museum Limited</h4>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 18,
                          fontFamily: 'sen',
                          fontWeight: '400',
                          color: 'white',
                          display: 'inline-block',
                        }}
                      >
                        The world's first digital museum dedicated to color—and
                        <span
                          className={
                            animation
                              ? 'animated_phrase_big'
                              : 'animated_phrase_small'
                          }
                        >
                          {animation ? ' meaning.' : ' money.'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex' }}>
                    <div>
                      {' '}
                      <h4 style={{ margin: '0px' }}>Est. 2022</h4>
                    </div>
                    <div className={styles.footerLink}>
                      {' '}
                      <Link href='/terms'>Terms</Link>
                    </div>
                    <div className={styles.footerLink}>
                      {' '}
                      <Link href='/privacy'>Privacy</Link>
                    </div>
                    <div className={styles.footerLink}>
                      {' '}
                      <a href='https://discord.gg/colormuseum' target='_blank'>
                        <SiDiscord />
                      </a>
                    </div>
                    <div className={styles.footerLink}>
                      {' '}
                      <a
                        href='https://twitter.com/colordotmuseum'
                        target='_blank'
                      >
                        <AiFillTwitterCircle />
                      </a>
                    </div>
                    <div className={styles.footerLink}>
                      {' '}
                      <a href='mailto:hello@color.museum' target='_blank'>
                        <FiMail />
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className={`${styles.container_footer} ${!props.topPart ? styles.topPartAdd : null
                    }`}
                >
                  <div className={styles.circle_container}>
                    <div className={styles.flex}>
                      <h3 className={styles.versonText}>BETA v1.0.5</h3>
                      <div className={styles.circle} />
                      <h4>
                        <a href='https://status.color.museum' target={'_blank'}>
                          All systems operational.
                        </a>
                      </h4>
                    </div>
                    <div className={styles.report}>
                      <div
                        onClick={() => Gleap.startFeedbackFlow('bugreporting')}
                        style={{ cursor: 'pointer', fontSize: '1rem' }}
                      >
                        REPORT AN ISSUE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.mobile_footer}>
              <div className={styles.flex_container}>
                <div className={styles.container_footer}>
                  <div style={{ display: 'block' }}>
                    <div className={styles.footerLink}>
                      {' '}
                      <a
                        href='https://twitter.com/colordotmuseum'
                        target='_blank'
                      >
                        <AiFillTwitterCircle />
                      </a>
                    </div>
                    <div className={styles.footerLink}>
                      {' '}
                      <a href='https://discord.gg/colormuseum' target='_blank'>
                        <SiDiscord />
                      </a>
                    </div>
                    <div className={styles.footerLink}>
                      {' '}
                      <a href='mailto:hello@color.museum' target='_blank'>
                        <FiMail />
                      </a>
                    </div>
                    <div className={styles.footerLink}>
                      {' '}
                      <Link href='/terms'>Terms</Link>
                    </div>
                    <div className={styles.footerLink}>
                      {' '}
                      <Link href='/privacy'>Privacy</Link>
                    </div>
                    <div style={{ margin: '10px 0' }}>
                      {' '}
                      <h4 style={{ margin: '0px' }}>Est. 2022</h4>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>© Color Museum Limited</h4>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 18,
                        fontFamily: 'sen',
                        fontWeight: '400',
                        color: 'white',
                        display: 'inline-block',
                        margin: '5px 0 0',
                      }}
                    >
                      The world's first digital museum <br /> dedicated to
                      color—and
                      <span
                        className={
                          animation
                            ? 'animated_phrase_big'
                            : 'animated_phrase_small'
                        }
                      >
                        {animation ? ' meaning.' : ' money.'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={styles.container_footer}>
                  <div className={styles.circle_container}>
                    <div className={styles.flex}>
                      <h3 className={styles.versonText}>BETA v1.0.5</h3>
                      <div className={styles.circle} />
                      <h4>
                        <a href='https://status.color.museum' target={'_blank'}>
                          All systems operational.
                        </a>
                      </h4>
                    </div>
                    <div className={styles.report}></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </footer>
      )}
    </div>
  );
};

export default Footer;
