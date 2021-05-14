import React, { useState } from 'react';
import styles from '../../styles/modules/notification/notification.module.css';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { styled } from '@stitches/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { FiArrowUpRight } from 'react-icons/fi';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import {
  StyledTrigger,
  StyledPrimitiveValue,
  StyledPrimitiveIcon,
  StyledContentFilter,
  StyledViewport,
  StyledItem,
  StyledItemIndicator,
  StyledLabel,
  scrollButtonStyles,
} from './selectStyles';

const StyledScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles
);

const StyledScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles
);

// Exports
export const Select = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger;
export const SelectValue = StyledPrimitiveValue;
export const SelectIcon = StyledPrimitiveIcon;
export const SelectContent = StyledContentFilter;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectLabel = StyledLabel;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;

const index = () => {
  const options = ['All', 'Read', 'Unread'];
  const [selectedOption, setSelectedOption] = useState('All');

  const [notificationList, setNotificationList] = useState('');

  return (
    <article className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.notificationDiv}>
          <div className={styles.header}>
            <div className={styles.leftHead}>
              <h3>Notifications</h3>
              <div className={styles.selectBox}>
                <Select
                  defaultValue={selectedOption}
                  value={selectedOption}
                  onValueChange={setSelectedOption}
                >
                  <SelectTrigger aria-label={selectedOption}>
                    <SelectValue aria-label={selectedOption} />
                    <SelectIcon>
                      <ChevronDownIcon className={styles.icon} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectScrollUpButton>
                      <ChevronUpIcon />
                    </SelectScrollUpButton>
                    <SelectViewport>
                      <SelectGroup>
                        <SelectLabel>Sort By</SelectLabel>
                        {options.map((item) => {
                          return (
                            <SelectItem value={item}>
                              <SelectItemText>{item}</SelectItemText>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectViewport>
                    <SelectScrollDownButton>
                      <ChevronDownIcon className={styles.icon} />
                    </SelectScrollDownButton>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className={styles.rightHead}>
              <h4>Mark all as seen</h4>
              <AiOutlineCheckCircle color='#fff' />
            </div>
          </div>
          <div className={styles.contentDiv}>
            {notificationList.length !== 0 ? (
              <div className={styles.blankList}>
                <h2>No new activity to report.</h2>
              </div>
            ) : (
              <ul className={styles.notificationList}>
                <li>
                  <div className={styles.listLeft}>
                    <div
                      className={styles.colorBox}
                      style={{ background: 'red' }}
                    ></div>
                    <div className={styles.listContent}>
                      <h3>LISTED</h3>
                      <h2>
                        Color NFT: 2342608 is now listed for sale for 0.987 ETH.
                      </h2>
                      <p>Expires on 6/12/22 12:00 GMT</p>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <span>12 hours ago </span>
                    <FiArrowUpRight color='#fff' />
                  </div>
                </li>
                <li>
                  <div className={styles.listLeft}>
                    <div
                      className={styles.colorBox}
                      style={{ background: 'red' }}
                    ></div>
                    <div className={styles.listContent}>
                      <h3>LISTED</h3>
                      <h2>
                        Color NFT: 2342608 is now listed for sale for 0.987 ETH.
                      </h2>
                      <p>Expires on 6/12/22 12:00 GMT</p>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <span>12 hours ago</span>
                    <FiArrowUpRight color='#fff' />
                  </div>
                </li>
                <li>
                  <div className={styles.listLeft}>
                    <div
                      className={styles.colorBox}
                      style={{ background: 'red' }}
                    ></div>
                    <div className={styles.listContent}>
                      <h3>LISTED</h3>
                      <h2>
                        Color NFT: 2342608 is now listed for sale for 0.987 ETH.
                      </h2>
                      <p>Expires on 6/12/22 12:00 GMT</p>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <span>12 hours ago</span>
                    <FiArrowUpRight color='#fff' />
                  </div>
                </li>
                <li>
                  <div className={styles.listLeft}>
                    <div
                      className={styles.colorBox}
                      style={{ background: 'red' }}
                    ></div>
                    <div className={styles.listContent}>
                      <h3>LISTED</h3>
                      <h2>
                        Color NFT: 2342608 is now listed for sale for 0.987 ETH.
                      </h2>
                      <p>Expires on 6/12/22 12:00 GMT</p>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <span>12 hours ago</span>
                    <FiArrowUpRight color='#fff' />
                  </div>
                </li>
                <li>
                  <div className={styles.listLeft}>
                    <div
                      className={styles.colorBox}
                      style={{ background: 'red' }}
                    ></div>
                    <div className={styles.listContent}>
                      <h3>LISTED</h3>
                      <h2>
                        Color NFT: 2342608 is now listed for sale for 0.987 ETH.
                      </h2>
                      <p>Expires on 6/12/22 12:00 GMT</p>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <span>12 hours ago</span>
                    <FiArrowUpRight color='#fff' />
                  </div>
                </li>
                <li>
                  <div className={styles.listLeft}>
                    <div
                      className={styles.colorBox}
                      style={{ background: 'red' }}
                    ></div>
                    <div className={styles.listContent}>
                      <h3>LISTED</h3>
                      <h2>
                        Color NFT: 2342608 is now listed for sale for 0.987 ETH.
                      </h2>
                      <p>Expires on 6/12/22 12:00 GMT</p>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <span>12 hours ago</span>
                    <FiArrowUpRight color='#fff' />
                  </div>
                </li>
                <li>
                  <div className={styles.listLeft}>
                    <div
                      className={styles.colorBox}
                      style={{ background: 'red' }}
                    ></div>
                    <div className={styles.listContent}>
                      <h3>LISTED</h3>
                      <h2>
                        Color NFT: 2342608 is now listed for sale for 0.987 ETH.
                      </h2>
                      <p>Expires on 6/12/22 12:00 GMT</p>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <span>12 hours ago</span>
                    <FiArrowUpRight color='#fff' />
                  </div>
                </li>
                <li>
                  <div className={styles.listLeft}>
                    <div
                      className={styles.colorBox}
                      style={{ background: 'red' }}
                    ></div>
                    <div className={styles.listContent}>
                      <h3>LISTED</h3>
                      <h2>
                        Color NFT: 2342608 is now listed for sale for 0.987 ETH.
                      </h2>
                      <p>Expires on 6/12/22 12:00 GMT</p>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <span>12 hours ago</span>
                    <FiArrowUpRight color='#fff' />
                  </div>
                </li>
                <li>
                  <div className={styles.listLeft}>
                    <div
                      className={styles.colorBox}
                      style={{ background: 'red' }}
                    ></div>
                    <div className={styles.listContent}>
                      <h3>LISTED</h3>
                      <h2>
                        Color NFT: 2342608 is now listed for sale for 0.987 ETH.
                      </h2>
                      <p>Expires on 6/12/22 12:00 GMT</p>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <span>12 hours ago</span>
                    <FiArrowUpRight color='#fff' />
                  </div>
                </li>
                <li>
                  <div className={styles.listLeft}>
                    <div
                      className={styles.colorBox}
                      style={{ background: 'red' }}
                    ></div>
                    <div className={styles.listContent}>
                      <h3>LISTED</h3>
                      <h2>
                        Color NFT: 2342608 is now listed for sale for 0.987 ETH.
                      </h2>
                      <p>Expires on 6/12/22 12:00 GMT</p>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <span>12 hours ago</span>
                    <FiArrowUpRight color='#fff' />
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default index;
