import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { NFTCardContainer } from "../gallery/Views";

export default function AnimatedCards({ colors }) {
  const [cards, setCards] = useState([
    ["What are you doing now 1?", "Back - What are you doing now 1?"],
    ["What are you doing now 2?", "Back - What are you doing now 2?"],
    ["What are you doing now 3?", "Back - What are you doing now 3?"],
    ["What are you doing now 4?", "Back - What are you doing now 4?"],
    ["What are you doing now 5?", "Back - What are you doing now 5?"],
    ["What are you doing now 6?", "Back - What are you doing now 6?"],
    ["What are you doing now 6?", "Back - What are you doing now 6?"],
  ]);

  const [colorCards, setColorCards] = useState([
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
    {
      id: 0,
      color: "#245897",
      name: "This is Color NFT Card",
      number: 0,
      price_in_eth: 1.21,
    },
  ]);

  const [isCanHover, setIsCanHover] = useState(false);

  const cardRef = useRef(new Array(6));
  const cardFrontRef = useRef(new Array(6));
  const cardBackRef = useRef(new Array(6));
  const divRef = useRef();

  const [cardsAnimationValues, setCardsAnimationValues] = useState([
    {
      // First Animation
      rotation1: "random(-30, 30)",
      x1: -250,
      y1: -200,
      duration1: 0.5,
      delay1: 0.1,
      // Second Animation
      rotaion2: "random(-30, 30)",
      zoom2: 1.1,
      x2: "-=150",
      y2: "+=0",
      duration2: 0.5,
      after2: "+=10",
      // Third Animation
      rotation3: "+=0",
      zoom3: 1.1,
      x3: "+=0",
      y3: -2000,
      duration3: 1,
      after3: "+=2",
    },
    // Card 2
    {
      // First Animation
      rotation1: "random(-30, 30)",
      x1: -500,
      y1: -50,
      duration1: 0.5,
      delay1: 0.1,
      // Second Animation
      rotaion2: "random(-30, 30)",
      zoom2: 1.1,
      x2: "-=50",
      y2: "+=0",
      duration2: 0.5,
      after2: "+=10",
      // Third Animation
      rotation3: "+=0",
      zoom3: 1.1,
      x3: "+=0",
      y3: -2000,
      duration3: 1,
      after3: "+=2",
    },
    // Card 3
    {
      // First Animation
      rotation1: "random(-30, 30)",
      x1: -300,
      y1: 300,
      duration1: 0.5,
      delay1: 0.1,
      // Second Animation
      rotaion2: "random(-30, 30)",
      zoom2: 1.1,
      x2: "-=100",
      y2: "+=0",
      duration2: 0.5,
      after2: "+=10",
      // Third Animation
      rotation3: "+=0",
      zoom3: 1.1,
      x3: "+=0",
      y3: -2000,
      duration3: 1,
      after3: "+=2",
    },
    {
      // First Animation
      rotation1: "random(-30, 30)",
      x1: 200,
      y1: 350,
      duration1: 0.5,
      delay1: 0.1,
      // Second Animation
      rotaion2: "random(-30, 30)",
      zoom2: 1.1,
      x2: "+=100",
      y2: "+=0",
      duration2: 0.5,
      after2: "+=10",
      // Third Animation
      rotation3: "+=0",
      zoom3: 1.1,
      x3: "+=0",
      y3: -2000,
      duration3: 1,
      after3: "+=2",
    },
    {
      // First Animation
      rotation1: "random(-30, 30)",
      x1: 350,
      y1: 150,
      duration1: 0.5,
      delay1: 0.1,
      // Second Animation
      rotaion2: "random(-30, 30)",
      zoom2: 1.1,
      x2: "+=150",
      y2: "+=0",
      duration2: 0.5,
      after2: "+=10",
      // Third Animation
      rotation3: "+=0",
      zoom3: 1.1,
      x3: "+=0",
      y3: -2000,
      duration3: 1,
      after3: "+=2",
    },
    {
      // First Animation
      rotation1: "random(-30, 30)",
      x1: 150,
      y1: -150,
      duration1: 0.5,
      delay1: 0.1,
      // Second Animation
      rotation2: "random(-30, 30)",
      zoom2: 1.1,
      x2: "+=100",
      y2: "+=9",
      duration2: 0.5,
      after2: "+=10",
      // Third Animation
      rotation3: "+=0",
      zoom3: 1.1,
      x3: "+=0",
      y3: -2000,
      duration3: 1,
      after3: "+=2",
    },
    {
      // First Animation
      rotation1: "random(-30, 30)",
      x1: -50,
      y1: -50,
      duration1: 0.5,
      delay1: 0.1,
      // Second Animation
      rotaion2: "random(-30, 30)",
      zoom2: 1.1,
      x2: "-=150",
      y2: "+=0",
      duration2: 0.5,
      after2: "+=10",
      // Third Animation
      rotation3: "+=0",
      zoom3: 1.1,
      x3: "+=0",
      y3: -2000,
      duration3: 1,
      after3: "+=2",
    },
  ]);

  useEffect(() => {
    var randomSortColor = colors.sort((a, b) => 0.5 - Math.random());
    var tempColorCards = randomSortColor.slice(0, 14);
    setColorCards(tempColorCards);

    var divtl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    divtl.fromTo(
      divRef.current,
      {
        opacity: 1,
      },
      {
        opacity: 1,
        duration: 0.5,
        ease: "expo.out",
      }
    );
    divtl.to(
      divRef.current,
      {
        opacity: 0.2,
        duration: 0.5,
      },
      "+=1"
    );

    divtl.to(
      divRef.current,
      {
        opacity: 0,
        duration: 1,
      },
      "+=11.6"
    );

    cardsAnimationValues.forEach((cardAnimation, index) => {
      gsap.set(cardRef.current[index], { transformStyle: "preserve-3d" });
      gsap.set(cardBackRef.current[index], { rotationY: -180 });
      gsap.set([cardBackRef.current[index], cardFrontRef.current[index]], {
        backfaceVisibility: "hidden",
      });

      var cardtl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      cardtl.fromTo(
        cardRef.current[index],
        {
          y: -2000,
          zoom: 1,
        },
        {
          y: "+=2000",
          duration: 0.5,
          ease: "expo.out",
        }
      );

      cardtl.to(
        cardRef.current[index],
        {
          rotation: cardAnimation.rotation1,
          x: cardAnimation.x1,
          y: cardAnimation.y1,
          duration: cardAnimation.duration1,
          delay: cardAnimation.delay1,
          ease: "bounce.out",
          onComplete: () => {
            setIsCanHover(true);
          },
        },
        "+=0"
      );

      cardtl.to(
        cardRef.current[index],
        {
          rotation: cardAnimation.rotaion2,
          rotationY: 180,
          zoom: cardAnimation.zoom2,
          x: cardAnimation.x2,
          y: cardAnimation.y2,
          duration: cardAnimation.duration2,
          onStart: () => {
            setIsCanHover(false);
          },
        },
        cardAnimation.after2
      );

      cardtl.to(
        cardRef.current[index],
        {
          rotation: cardAnimation.rotaion3,
          zoom: cardAnimation.zoom3,
          x: cardAnimation.x3,
          y: cardAnimation.y3,
          duration: cardAnimation.duration3,
          ease: "power1.out",
          onComplete: () => {
            var randomSortColor = colors.sort((a, b) => 0.5 - Math.random());
            var tempColorCards = randomSortColor.slice(0, 14);
            setColorCards(tempColorCards);
          },
        },
        cardAnimation.after3
      );
    });
  }, []);

  const handleMouseEnter = (e, index) => {
    if (!isCanHover) return;
    gsap.to(cardRef.current[index], {
      rotation: 0,
      zoom: "+=0.1",
      duration: 0.1,
    });
  };

  const handleMouseLeave = (e, index) => {
    if (!isCanHover) return;
    gsap.to(cardRef.current[index], {
      rotation: "random(-30, 30)",
      zoom: "-=0.1",
      duration: 0.1,
    });
  };

  return (
    <div
      ref={divRef}
      style={{ position: "relative", height: "100%", opacity: 0.2 }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
          }}
        >
          {cards.map((card, index) => {
            return (
              <div
                key={"card" + index}
                ref={(element) => (cardRef.current[index] = element)}
              >
                <div
                  // onMouseEnter={(e) => handleMouseEnter(e, index)}
                  // onMouseLeave={(e) => handleMouseLeave(e, index)}
                  ref={(element) => (cardFrontRef.current[index] = element)}
                  style={{
                    position: "absolute",
                    width: "250px",
                    height: "350px",
                    background: "transparent",
                    borderStyle: "none",
                    cursor: "pointer",
                    left: "-125px",
                    top: "-175px",
                  }}
                >
                  <NFTCardContainer
                    id={colorCards[index + 6].uint256}
                    color={colorCards[index + 6].hex}
                    name={colorCards[index + 6].name}
                    number={colorCards[index + 6].nftNo}
                    price={colorCards[index + 6].price_in_eth.toFixed(2)}
                  />
                </div>

                <div
                  // onMouseEnter={handleMouseEnter}
                  // onMouseLeave={handleMouseLeave}
                  ref={(element) => (cardBackRef.current[index] = element)}
                  style={{
                    position: "absolute",
                    width: "250px",
                    height: "350px",
                    background: "transparent",
                    borderStyle: "none",
                    cursor: "pointer",
                    left: "-125px",
                    top: "-175px",
                  }}
                >
                  <NFTCardContainer
                    id={colorCards[index].uint256}
                    color={colorCards[index].hex}
                    name={colorCards[index].name}
                    number={colorCards[index].nftNo}
                    price={colorCards[index].price_in_eth.toFixed(2)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
