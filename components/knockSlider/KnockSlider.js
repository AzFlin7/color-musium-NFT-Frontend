import { isMobile } from "react-device-detect";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import {
  KnockFeedProvider,
  useKnockFeed,
} from "@knocklabs/react-notification-feed";
import { knock_publicKey } from "../../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import stylesContent from "../../styles/modules/knockSlider/knockSlider.module.css";
import moment from "moment";
import { FiArrowUpRight } from "react-icons/fi";
import {
  StyledTrigger2,
  StyledTrigger,
  StyledPrimitiveValue,
  StyledPrimitiveIcon,
  StyledContent,
  StyledViewport,
  StyledItem,
  StyledItemIndicator,
  StyledLabel,
  scrollButtonStyles,
} from "./DropDownCss";
import { BsChevronDown } from "react-icons/bs";
import { BsChevronUp } from "react-icons/bs";
import { styled } from "@stitches/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import Knock from "@knocklabs/client";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";
import {
  notificationOff,
  notifictionCount,
} from "../../store/actions/notification";
import { TbBell } from "react-icons/tb";

const StyledScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles
);

const StyledScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles
);

// select 2
export const SelectTrigger2 = StyledTrigger2;
// Exports
export const Select = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger;
export const SelectValue = StyledPrimitiveValue;
export const SelectIcon = StyledPrimitiveIcon;
export const SelectContent = StyledContent;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectLabel = StyledLabel;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;
const KnockSlider = () => {
  const [knock_userID, setKnock_userID] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const { localStorageChange } = useSelector((state) => state.toggle);

  const getJWTToken = async () => {
    var jwtToken = await axios({
      method: "PATCH",
      url: "https://orders.color.museum/api/v1/others",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ user_id: knock_userID }),
    });
    setJwtToken(await jwtToken.data);
    return await jwtToken.data;
  };
  useEffect(async () => {
    if (knock_userID) {
      await getJWTToken();
    }
  }, [knock_userID]);

  useEffect(async () => {
    let userData = localStorage.getItem("userData");
    if (userData === undefined) {
      localStorage.removeItem("userData");
    }
    if (userData) {
      userData = JSON.parse(userData);
      setKnock_userID(userData.knock_id);
    }
  }, [localStorageChange]);

  const [dropdownValue, setDropdownValue] = useState("All");
  const [knockFeed, setKnockFeed] = useState();
  useEffect(() => {
    const knock = new Knock(knock_publicKey);
    knock.authenticate(knock_userID, jwtToken);
    setKnockFeed(
      knock.feeds.initialize("a204096d-9339-4cad-a836-7766d69ef8b4")
    );
  }, []);

  //
  const allReceivedStates = ["All", "Bid", "List", "Sold", "Purchased"];
  const [selectedState, setSelectedState] = useState("All");
  const dispatch = useDispatch();
  const { notificationSlide } = useSelector((state) => state.notification);
  return (
    <SlidingPane
      closeIcon={
        <IoIosArrowBack
          onClick={() => {
            dispatch(notificationOff());
          }}
        />
      }
      className={stylesContent.newSlideContainer}
      isOpen={notificationSlide}
      title={
        <div className={stylesContent.newPurchaseTitle}>
          <div style={{ display: "flex", alignItems: "center" }}>
            Notifications&nbsp;
            <div style={{ marginLeft: "10px" }}>
              <Select
                defaultValue={selectedState}
                value={selectedState}
                onValueChange={setSelectedState}
              >
                <SelectTrigger aria-label={setSelectedState}>
                  <SelectValue aria-label={setSelectedState} />
                  <SelectIcon>
                    <BsChevronDown
                      style={{
                        width: "20px",
                        height: "20px",
                        marginTop: "2px",
                        marginLeft: "5px",
                      }}
                    />
                  </SelectIcon>
                </SelectTrigger>
                <SelectContent>
                  <SelectScrollUpButton>
                    <BsChevronUp />
                  </SelectScrollUpButton>
                  <SelectViewport>
                    <SelectGroup>
                      {allReceivedStates.map((item, i) => {
                        return (
                          <SelectItem value={item} key={i}>
                            <SelectItemText>{item}</SelectItemText>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectViewport>
                  <SelectScrollDownButton>
                    <BsChevronDown
                      style={{
                        width: "20px",
                        height: "20px",
                        marginTop: "2px",
                        marginLeft: "5px",
                      }}
                    />
                  </SelectScrollDownButton>
                </SelectContent>
              </Select>
            </div>
            <div style={{ marginLeft: "10px" }}>
              {/* <Select
                defaultValue={dropdownValue}
                value={dropdownValue}
                onValueChange={setDropdownValue}
              >
                <SelectTrigger aria-label={setDropdownValue}>
                  <SelectValue aria-label={setDropdownValue} />
                  <SelectIcon>
                    <BsChevronDown
                      style={{
                        width: "20px",
                        height: "20px",
                        marginTop: "2px",
                        marginLeft: "5px",
                      }}
                    />
                  </SelectIcon>
                </SelectTrigger>
                <SelectContent>
                  <SelectScrollUpButton>
                    <BsChevronUp />
                  </SelectScrollUpButton>
                  <SelectViewport>
                    <SelectGroup>
                      <SelectItem value="All">
                        <SelectItemText>All</SelectItemText>
                      </SelectItem>
                      <SelectItem value="Read">
                        <SelectItemText>Read</SelectItemText>
                      </SelectItem>
                      <SelectItem value="Unread">
                        <SelectItemText>Unread</SelectItemText>
                      </SelectItem>
                    </SelectGroup>
                  </SelectViewport>
                  <SelectScrollDownButton>
                    <BsChevronDown
                      style={{
                        width: "20px",
                        height: "20px",
                        marginTop: "2px",
                        marginLeft: "5px",
                      }}
                    />
                  </SelectScrollDownButton>
                </SelectContent>
              </Select> */}
            </div>
          </div>
          <span style={{ display: "flex", alignItems: "center" }}>
            <IoCloseSharp
              onClick={() => {
                dispatch(notificationOff());
              }}
            />
          </span>
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        dispatch(notificationOff());
      }}
    >
      <>
        <div>
          <KnockFeedProvider
            apiKey={knock_publicKey}
            feedId={"a204096d-9339-4cad-a836-7766d69ef8b4"}
            userId={knock_userID}
            userToken={jwtToken}
          >
            <FeedList
              dropdownValue={dropdownValue}
              knockFeed={knockFeed}
              // setAmountOfNewNotifications={setAmountOfNewNotifications}
              selectedState={selectedState}
            />
          </KnockFeedProvider>
        </div>
      </>
    </SlidingPane>
  );
};

export default KnockSlider;

const FeedList = ({ dropdownValue, knockFeed, selectedState }) => {
  const { useFeedStore } = useKnockFeed();
  const items = useFeedStore((state) => state.items);
  const { notificationSlide } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    const data = items.filter((i) => {
      return !i.read_at;
    });
    dispatch(notifictionCount(data.length));
  }, [items, notificationSlide]);

  const [amountOfKnockNotifications, setAmountOfKnockNotifications] =
    useState(0);

  useEffect(() => {
    const data = items.filter((i) => {
      if (selectedState.toUpperCase() === "ALL") {
        if (dropdownValue === "All") {
          return i;
        } else if (dropdownValue === "Read" && i.read_at) {
          return i;
        } else if (dropdownValue === "Unread" && !i.read_at) {
          return i;
        }
      } else {
        if (
          dropdownValue === "All" &&
          i.data.subject.includes(selectedState.toUpperCase())
          // ||
          // (selectedState === "List" &&
          //   (i.data.startsWith("Ask") || i.data.startsWith("Sell")))
        ) {
          return i;
        } else if (
          dropdownValue === "Read" &&
          i.read_at &&
          i.data.subject.includes(selectedState.toUpperCase())
          // ||
          // (selectedState === "List" &&
          //   (i.data.startsWith("Ask") || i.data.startsWith("Sell")))
        ) {
          return i;
        } else if (
          dropdownValue === "Unread" &&
          !i.read_at &&
          i.data.subject.includes(selectedState.toUpperCase())
          // ||
          // (selectedState === "List" &&
          //   (i.data.startsWith("Ask") || i.data.startsWith("Sell")))
        ) {
          return i;
        }
      }
    });
    setAmountOfKnockNotifications(data);
  }, [items, selectedState, dropdownValue]);

  return items.length > 0 && amountOfKnockNotifications.length > 0 ? (
    items.map((item, i) => {
      // const color = Web3.utils.numberToHex(item.data.tokenID);

      let color = Web3.utils.numberToHex(item.data.tokenID);
      color = color.slice(2);
      color = "#" + color;
      color =
        color.length === 3
          ? color + color.slice(1, 3)
          : color.length > 7
          ? color.slice(0, 7)
          : color;

      if (selectedState.toUpperCase() === "ALL") {
        if (dropdownValue === "All") {
          return (
            <a
              href={`https://color.museum/gallery/color-nft/${item.data.tokenID}`}
              target="_blank"
              className={stylesContent.content}
              key={i}
              onLoad={() => {
                if (!item.read_at) {
                  console.log(
                    `Should mark as read item with token id: ${item.data.tokenID}`
                  );
                  knockFeed.markAsRead(item);
                }
              }}
            >
              <div
                style={{
                  background: color ? color : "#abcdef",
                }}
                className={stylesContent.blockGrid}
              />
              <div className={stylesContent.mainContainer}>
                <h3>{item.data.subject}</h3>
                <h1 dangerouslySetInnerHTML={{ __html: item.data.content }} />
                <h3 className={stylesContent.expiryText}>{item.data.expiry}</h3>
              </div>
              <div className={stylesContent.fromNowContainer}>
                <p>
                  {moment(item.inserted_at).fromNow()}&nbsp;ago&nbsp;
                  <FiArrowUpRight />
                </p>
              </div>
            </a>
          );
        } else if (dropdownValue === "Read" && item.read_at) {
          return (
            <a
              href={`https://color.museum/gallery/color-nft/${item.data.tokenID}`}
              target="_blank"
              className={stylesContent.content}
              key={i}
              onLoad={() => {
                if (!item.read_at) {
                  console.log(
                    `Should mark as read item with token id: ${item.data.tokenID}`
                  );
                  knockFeed.markAsRead(item);
                }
              }}
            >
              <div
                style={{
                  background: color ? color : "#abcdef",
                }}
                className={stylesContent.blockGrid}
              />
              <div className={stylesContent.mainContainer}>
                <h3>{item.data.subject}</h3>
                <h1 dangerouslySetInnerHTML={{ __html: item.data.content }} />
                <h3 className={stylesContent.expiryText}>{item.data.expiry}</h3>
              </div>
              <div className={stylesContent.fromNowContainer}>
                <p>
                  {moment(item.inserted_at).fromNow()}&nbsp;ago&nbsp;
                  <FiArrowUpRight />
                </p>
              </div>
            </a>
          );
        } else if (dropdownValue === "Unread" && !item.read_at) {
          return (
            <a
              href={`https://color.museum/gallery/color-nft/${item.data.tokenID}`}
              target="_blank"
              className={stylesContent.content}
              key={i}
              onLoad={() => {
                if (!item.read_at) {
                  console.log(
                    `Should mark as read item with token id: ${item.data.tokenID}`
                  );
                  knockFeed.markAsRead(item);
                }
              }}
            >
              <div
                style={{
                  background: color ? color : "#abcdef",
                }}
                className={stylesContent.blockGrid}
              />
              <div className={stylesContent.mainContainer}>
                <h3>{item.data.subject}</h3>
                <h1 dangerouslySetInnerHTML={{ __html: item.data.content }} />
                <h3 className={stylesContent.expiryText}>{item.data.expiry}</h3>
              </div>
              <div className={stylesContent.fromNowContainer}>
                <p>
                  {moment(item.inserted_at).fromNow()}&nbsp;ago&nbsp;
                  <FiArrowUpRight />
                </p>
              </div>
            </a>
          );
        }
      } else {
        if (
          (dropdownValue === "All" &&
            item.data.subject.includes(selectedState.toUpperCase())) ||
          (selectedState === "List" &&
            (item.data.subject.startsWith("Ask") ||
              item.data.subject.startsWith("Sell")))
        ) {
          return (
            <a
              href={`https://color.museum/gallery/color-nft/${item.data.tokenID}`}
              target="_blank"
              className={stylesContent.content}
              key={i}
              onLoad={() => {
                if (!item.read_at) {
                  console.log(
                    `Should mark as read item with token id: ${item.data.tokenID}`
                  );
                  knockFeed.markAsRead(item);
                }
              }}
            >
              <div
                style={{
                  background: color ? color : "#abcdef",
                }}
                className={stylesContent.blockGrid}
              />
              <div className={stylesContent.mainContainer}>
                <h3>{item.data.subject}</h3>
                <h1 dangerouslySetInnerHTML={{ __html: item.data.content }} />
                <h3 className={stylesContent.expiryText}>{item.data.expiry}</h3>
              </div>
              <div className={stylesContent.fromNowContainer}>
                <p>
                  {moment(item.inserted_at).fromNow()}&nbsp;ago&nbsp;
                  <FiArrowUpRight />
                </p>
              </div>
            </a>
          );
        } else if (
          (dropdownValue === "Read" &&
            item.read_at &&
            item.data.subject.includes(selectedState.toUpperCase())) ||
          (selectedState === "List" &&
            (item.data.subject.startsWith("Ask") ||
              item.data.subject.startsWith("Sell")))
        ) {
          return (
            <a
              href={`https://color.museum/gallery/color-nft/${item.data.tokenID}`}
              target="_blank"
              className={stylesContent.content}
              key={i}
              onLoad={() => {
                if (!item.read_at) {
                  console.log(
                    `Should mark as read item with token id: ${item.data.tokenID}`
                  );
                  knockFeed.markAsRead(item);
                }
              }}
            >
              <div
                style={{
                  background: color ? color : "#abcdef",
                }}
                className={stylesContent.blockGrid}
              />
              <div className={stylesContent.mainContainer}>
                <h3>{item.data.subject}</h3>
                <h1 dangerouslySetInnerHTML={{ __html: item.data.content }} />
                <h3 className={stylesContent.expiryText}>{item.data.expiry}</h3>
              </div>
              <div className={stylesContent.fromNowContainer}>
                <p>
                  {moment(item.inserted_at).fromNow()}&nbsp;ago&nbsp;
                  <FiArrowUpRight />
                </p>
              </div>
            </a>
          );
        } else if (
          (dropdownValue === "Unread" &&
            !item.read_at &&
            item.data.subject.includes(selectedState.toUpperCase())) ||
          (selectedState === "List" &&
            (item.data.subject.startsWith("Ask") ||
              item.data.subject.startsWith("Sell")))
        ) {
          return (
            <a
              href={`https://color.museum/gallery/color-nft/${item.data.tokenID}`}
              target="_blank"
              className={stylesContent.content}
              key={i}
              onLoad={() => {
                if (!item.read_at) {
                  console.log(
                    `Should mark as read item with token id: ${item.data.tokenID}`
                  );
                  knockFeed.markAsRead(item);
                }
              }}
            >
              <div
                style={{
                  background: color ? color : "#abcdef",
                }}
                className={stylesContent.blockGrid}
              />
              <div className={stylesContent.mainContainer}>
                <h3>{item.data.subject}</h3>
                <h1 dangerouslySetInnerHTML={{ __html: item.data.content }} />
                <h3 className={stylesContent.expiryText}>{item.data.expiry}</h3>
              </div>
              <div className={stylesContent.fromNowContainer}>
                <p>
                  {moment(item.inserted_at).fromNow()}&nbsp;ago&nbsp;
                  <FiArrowUpRight />
                </p>
              </div>
            </a>
          );
        }
      }
    })
  ) : (
    <div className={`${stylesContent.noContentWrapper} emprtyText`}>
      <TbBell />
      <h1>No new activity to report.</h1>
      <p>Notifications related to offers and orders will appear here.</p>
    </div>
  );
};
