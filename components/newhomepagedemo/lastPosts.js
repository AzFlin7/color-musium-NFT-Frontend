import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { GrFormNext } from "react-icons/gr";
import styles from "../../styles/modules/newhomepagedemo/bulletinNew.module.css";
import { isMobile } from "react-device-detect";

const lastPosts = (posts) => {
  const finalData = posts.posts.sort(function (a, b) {
    if (a.publishedAt.slice(0, 10) > b.publishedAt.slice(0, 10)) {
      return 1;
    }
    if (a.publishedAt.slice(0, 10) < b.publishedAt.slice(0, 10)) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });

  const [addAnimation, setAddAnimation] = useState({ status: false, key: "" });

  return (
    <>
      <section className={styles.wrapper}>
        {isMobile && isMobile ? (
          <div>
            <article className={styles.mainPostMobile}>
              {finalData &&
                finalData
                  .slice(0, 5)
                  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
                  .map((item, index) => {
                    return (
                      <Link
                        key={index}
                        href={`/comms/${item.slug.current}`}
                        passHref
                      >
                        <div className={styles.containerPostMobile}>
                          <div className={styles.postInnerMobile}>
                            <div className={styles.topPartDate}>
                              <h3>ROADMAP</h3>
                            </div>
                            <div className={styles.titlePostImageMobile}>
                              <div className={styles.titlePostMobile}>
                                <h1>{item.title ? item.title : "Title"}</h1>
                              </div>
                              <div className={styles.authorMainDiv}>
                                {item.author._ref ===
                                "1b1c7451-c976-48fd-b416-73bf5a356f10" ? (
                                  <img
                                    src="/images/omarFarooqComms.jpg"
                                    alt="omarFarooqComms"
                                    className={styles.authorImage}
                                  />
                                ) : null}
                                <div className={styles.author_date}>
                                  {item.author._ref ===
                                  "1b1c7451-c976-48fd-b416-73bf5a356f10"
                                    ? "Omar Farooq"
                                    : "Author Name"}
                                  <h4>
                                    {item.publishedAt
                                      ? format(
                                          parseISO(item.publishedAt),
                                          "LLL d, uuuu"
                                        )
                                      : "00"}
                                  </h4>
                                </div>
                                <span className={styles.author_nickName}>
                                  {item.author.name === "Omar Farooq"
                                    ? "curator"
                                    : null}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
            </article>
          </div>
        ) : (
          <article className={styles.mainPost}>
            {finalData &&
              finalData
                .slice(0, 5)
                .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
                .map((item, index) => {
                  return (
                    <Link
                      key={index}
                      href={`/comms/${item.slug.current}`}
                      passHref
                    >
                      <div
                        className={`${styles.containerPost} ${
                          addAnimation.status &&
                          addAnimation.key === index &&
                          styles.animation
                        }`}
                        onMouseEnter={() =>
                          setAddAnimation({ status: true, key: index })
                        }
                        onMouseLeave={() =>
                          setAddAnimation({ status: false, key: index })
                        }
                      >
                        <div className={styles.addBorder}>
                          <div className={styles.postInner}>
                            <div className={styles.titlePost}>
                              <h1>{item.title ? item.title : "Title"}</h1>
                            </div>
                            <h3>ROADMAP</h3>
                            <div className={styles.authorMainDiv}>
                              {item.author._ref ===
                              "1b1c7451-c976-48fd-b416-73bf5a356f10" ? (
                                <img
                                  src="/images/omarFarooqComms.jpg"
                                  alt="omarFarooqComms"
                                  className={styles.authorImage}
                                />
                              ) : null}
                              <div className={styles.author_date}>
                                {item.author._ref ===
                                "1b1c7451-c976-48fd-b416-73bf5a356f10"
                                  ? "Omar Farooq"
                                  : "Author Name"}
                              </div>
                              <span className={styles.author_nickName}>
                                {item.author.name === "Omar Farooq"
                                  ? "curator"
                                  : null}
                              </span>
                              <h4>
                                {item.publishedAt
                                  ? format(
                                      parseISO(item.publishedAt),
                                      "LLL d, uuuu"
                                    )
                                  : "00"}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
          </article>
        )}
      </section>
    </>
  );
};

export default lastPosts;
