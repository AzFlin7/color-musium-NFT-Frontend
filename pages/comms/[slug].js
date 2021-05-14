import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../client";
import Head from "next/head";
import { Link } from "@mui/material";
import { GrFormNext } from "react-icons/gr";
import { format } from "date-fns";
import styles from "../../styles/modules/bulletin/post.module.css";
import stylesWrapper from "../../styles/modules/choose/choose.module.css";
import { useRouter } from "next/router";
import YouTube from "react-youtube";
import { isMobile } from "react-device-detect";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

const Post = ({ post }) => {
  console.log(post);
  const router = useRouter();
  if (post !== undefined) {
    const { body, author, categories, title, mainImage, publishedAt } = post;

    console.log("post", post);
    const opts = {
      height: isMobile ? "250px" : "390",
      width: isMobile ? "350px" : "640",
      playerVars: {
        autoplay: 1,
        disablekb: 1,
      },
    };

    const onPlayerReady = (event) => {
      event.target.pauseVideo();
      event.target.mute();
      event.target.playVideo();
    };
    return (
      <>
        <Head>
          <title>Color Museum | {post.title && post.title}</title>

          <meta name="title" content={post.title && post.title} />
          <meta
            name="description"
            content={`${body[0].children[0].text && body[0].children[0].text
              }  ${body[0].children[1]
                ? body[0].children[1].text
                : body[1].children[0] && body[1].children[0].text
              }`}
          />

          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`${typeof window !== "undefined" && window.location.hostname
              }${router.asPath}`}
          />
          <meta property="og:title" content={post.title && post.title} />
          <meta
            property="og:description"
            content={`${body[0].children[0].text && body[0].children[0].text
              }  ${body[0].children[1]
                ? body[0].children[1].text
                : body[1].children[0] && body[1].children[0].text
              }`}
          />
          <meta
            property="og:image"
            content={
              mainImage.asset &&
              urlFor(mainImage).fit("crop").auto("format").url()
            }
          />

          <meta
            property="twitter:url"
            content={`${typeof window !== "undefined" && window.location.hostname
              }${router.asPath}`}
          />
          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:image"
            content={urlFor(mainImage).fit("crop").auto("format").url()}
          />
          <meta property="twitter:title" content={post.title} />
          <meta
            property="post:description"
            content={`${body[0].children[0].text && body[0].children[0].text
              }  ${body[0].children[1]
                ? body[0].children[1].text
                : body[1].children[0] && body[1].children[0].text
              }`}
          />
        </Head>
        <section
          className={stylesWrapper.wrapper}
          style={{ background: "#000" }}
        >
          <div className={styles.greyContainerBlock}>
            <div className={styles.flexHeader}>
              <Link href="/comms" passHref>
                <a className={styles.headerLink}>Comms</a>
              </Link>
              <GrFormNext className={styles.grformnext} />
              <h2 className={styles.subheader}>
                {categories[0]._ref === "a3d3f190-8cec-4529-86bd-8ac1291a3a1c"
                  ? "Minted"
                  : categories[0]._ref ===
                    "43fea9b5-df4d-4d0b-84b5-87b462a3fc9a"
                    ? "Calendar"
                    : categories[0]._ref ===
                      "332174bd-4e6f-4bee-ab8f-37c98ea11f8f"
                      ? "Instructions"
                      : categories[0]._ref ===
                        "ca8b9641-6d6c-4694-bb5d-c1f3e3bccae6"
                        ? "Roadmap"
                        : "Press Release"}
              </h2>
            </div>
            <article className={styles.container}>
              <p className={styles.date}>
                {publishedAt ? format(new Date(publishedAt), "MM.dd.yy") : null}
              </p>
              <h1 className={styles.header}>{title ? title : "NFT Title"}</h1>
              {mainImage.asset ? (
                <>
                  {/* {router.query.slug === "beta-v1-is-live" ? (
                    <YouTube
                      videoId="aS3f_yJyuMk"
                      opts={opts}
                      onReady={onPlayerReady}
                    />
                  ) : ( */}
                  <>
                    <img
                      className={styles.image}
                      src={urlFor(mainImage).fit("crop").auto("format").url()}
                      alt={mainImage.alt}
                    />
                    <h3 className={styles.secondHeader}>
                      {mainImage.alt ? mainImage.alt : null}
                    </h3>
                  </>
                  {/* )} */}
                </>
              ) : null}
            </article>
          </div>
          <article className={styles.container} style={{ paddingTop: "3rem" }}>
            {body
              ? body.map((item, index) => {
                if (item._type === "block") {
                  if (item.style === "normal") {
                    if (item.children.length === 1) {
                      if (item.markDefs[0]) {
                        return (
                          <div
                            className={styles.description}
                            key={index}
                            style={{
                              fontWeight:
                                item.children[0].marks[0] === "strong"
                                  ? "bold"
                                  : "medium",
                            }}
                          >
                            {item.children[0].text
                              ? item.children[0].text
                              : null}
                          </div>
                        );
                      } else {
                        return (
                          <p
                            className={styles.description}
                            key={index}
                            style={{
                              fontWeight:
                                item.children[0].marks[0] === "strong"
                                  ? "bold"
                                  : "medium",
                            }}
                          >
                            {item.children[0].text
                              ? item.children[0].text
                              : null}
                          </p>
                        );
                      }
                    } else if (item.children.length !== 1) {
                      if (item.markDefs[0]) {
                      }
                      return (
                        <div style={{ display: "flex" }} key={index}>
                          <p className={styles.description}>
                            {item.children.map((i, index) => {
                              if (i.marks[0] === "strong") {
                                return (
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                    }}
                                    key={index}
                                  >
                                    {i.text}
                                  </span>
                                );
                              } else if (
                                item.markDefs[0] &&
                                item.markDefs[0]._key === i.marks[0]
                              ) {
                                return (
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={item.markDefs[0].href}
                                    key={index}
                                  >
                                    {i.text}
                                  </a>
                                );
                              } else if (
                                item.markDefs[1] &&
                                item.markDefs[1]._key === i.marks[0]
                              ) {
                                return (
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={item.markDefs[1].href}
                                    key={index}
                                  >
                                    {i.text}
                                  </a>
                                );
                              } else if (
                                item.markDefs[2] &&
                                item.markDefs[2]._key === i.marks[0]
                              ) {
                                return (
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={item.markDefs[2].href}
                                    key={index}
                                  >
                                    {i.text}
                                  </a>
                                );
                              } else if (
                                item.markDefs[3] &&
                                item.markDefs[3]._key === i.marks[0]
                              ) {
                                return (
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={item.markDefs[3].href}
                                    key={index}
                                  >
                                    {i.text}
                                  </a>
                                );
                              } else if (
                                item.markDefs[4] &&
                                item.markDefs[4]._key === i.marks[0]
                              ) {
                                return (
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={item.markDefs[4].href}
                                    key={index}
                                  >
                                    {i.text}
                                  </a>
                                );
                              } else if (
                                item.markDefs[5] &&
                                item.markDefs[5]._key === i.marks[0]
                              ) {
                                return (
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={item.markDefs[5].href}
                                    key={index}
                                  >
                                    {i.text}
                                  </a>
                                );
                              } else if (
                                item.markDefs[6] &&
                                item.markDefs[6]._key === i.marks[0]
                              ) {
                                return (
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={item.markDefs[6].href}
                                    key={index}
                                  >
                                    {i.text}
                                  </a>
                                );
                              } else if (
                                item.markDefs[7] &&
                                item.markDefs[7]._key === i.marks[0]
                              ) {
                                return (
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={item.markDefs[7].href}
                                    key={index}
                                  >
                                    {i.text}
                                  </a>
                                );
                              } else {
                                return i.text;
                              }
                            })}
                          </p>
                        </div>
                      );
                    }
                  } else if (item.style === "h4") {
                    return (
                      <h4 className={styles.subtitleh4} key={index}>
                        {item.children[0].text ? item.children[0].text : null}
                      </h4>
                    );
                  }
                } else if (item._type === "image") {
                  return (
                    <img
                      className={styles.secondImage}
                      src={urlFor(item).fit("max").auto("format")}
                      alt={item.alt}
                      key={index}
                    />
                  );
                }
              })
              : null}
            <div className={styles.flex + " " + styles.authorMainDiv}>
              {author &&
                author._ref === "1b1c7451-c976-48fd-b416-73bf5a356f10" ? (
                <img
                  src="/images/omarFarooqComms.jpg"
                  alt="omarFarooqComms"
                  className={styles.authorImage}
                />
              ) : null}
              <p className={styles.author_date}>
                {author &&
                  author._ref === "1b1c7451-c976-48fd-b416-73bf5a356f10"
                  ? "Omar Farooq"
                  : "Author Name"}
              </p>
              <span className={styles.author_nickName}>
                {author &&
                  author._ref === "1b1c7451-c976-48fd-b416-73bf5a356f10"
                  ? "curator"
                  : null}
              </span>
            </div>
            {/* <div className={styles.buttonContainer}>
              Join presale
              <a
                href={'https://color.museum/choose'}
                target='_blank'
                rel='noreferrer'
                className={styles.animatedButton}
              >
                Mint Now
              </a>
            </div> */}
            {/* <div
              className={styles.flexContent}
              style={{ marginTop: "1rem", width: "90%", margin: "0 auto" }}
            >
              <button
                className={styles.whiteButton}
                onClick={() => router.push("/choose")}
              >
                Mint
              </button>
              <button
                className={styles.whiteButton}
                onClick={() => router.push("/gallery/color-nft")}
              >
                Trade
              </button>
              <button className={styles.whiteButton} onClick={() => {
                toast(
                  <div className={"toastComman"}>
                    Coming mid-Q3.
                    <IoClose
                      size={25}
                      onClick={(t) => {
                        toast.dismiss(t.id);
                      }}
                    />
                  </div>,
                  {
                    style: {
                      background: "#ff660d",
                    },
                  }
                );
              }}>Earn</button>
            </div> */}
          </article>
        </section>
      </>
    );
  } else {
    return null;
  }
};

const query = groq`*[_type == "post" && slug.current == $slug][0]{
                              title,
                              author,
                              body,
                              categories,
                              mainImage,
                              publishedAt,
                              slug,
                              title,
                              _createdAt,
                              _id,
                              _updatedAt,
}`;
export async function getStaticPaths() {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params;
  const post = await client.fetch(query, { slug });
  return {
    props: {
      post,
    },
  };
}
export default Post;
