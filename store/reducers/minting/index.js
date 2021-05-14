import { HYDRATE } from 'next-redux-wrapper';
import {
  COLORCHANGE,
  BLACKLISTEDHEX,
  NAMECHANGE,
  BLACKLISTEDNAME,
  DESCRIPTIONCHANGE,
  CONNECTEDADDRESS,
  PENDINGCONNECT,
  WEB3,
  HEXTONUMBER,
  GASPRICE,
  ISMINTING_ON,
  ISMINTING_OFF,
  TRANSACTIONHASH,
  PRICETOMINT,
  PRICETOMINTUSD,
  ONCHAINORDER_TOGGLE,
  CONNECTOR,
  PINISCHECKED_TOGGLE,
  DISCOUNT_APPLIED,
} from '../../actions';
var { _brandColors } = require('brand-colors');

const initialState = {
  whiteBorders: [
    '#000000',
    '#0F0F0F',
    '#0E0000',
    '#3C3C3D',
    '#3D3A46',
    '#080808',
    '#000001',
    '#0B0B0B',
    '#010101',
    '#123456',
    '#010000',
    '#0A0A0A',
    '#112233',
    '#221A44',
    '#000007',
    '#1A1A1A',
    '#3C2757',
    '#271828',
    '#12151A',
    '#2C2C2C',
    '#232323',
    '#1A3B00',
    '#000100',
    '#020202',
    '#060606',
    '#000605',
    '#333333',
    '#020101',
    '#070616',
    '#1E1E1E',
    '#111111',
    '#141414',
    '#09002D',
    '#420420',
    '#282828',
    '#030603',
    '#000500',
    '#040000',
    '#061D00',
    '#222222',
  ],
  connectedAddress: '',
  pendingConnect:true,
  web3: null,
  blackListedHEX: Object.values(_brandColors),
  blackListedNAME: Object.keys(_brandColors),
  choosenColorFinal: '',
  choosenNameFinal: '',
  choosenDescriptionFinal: '',
  transactionHash: '',
  hexToNumber: null,
  gasPrice: null,
  priceToMint: 0.25,
  priceToMintUsd: 0.25,
  isMinting: false,
  onChainOrder: true,
  connector: '',
  pinIsChecked: false,
  warnActive: true,
  applied: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.user };
    case COLORCHANGE:
      const newColorChange = { ...state };
      newColorChange.choosenColorFinal = action.payload;
      return newColorChange;
    case CONNECTOR:
      const newConnector = { ...state };
      newConnector.connector = action.payload;
      return newConnector;
    case NAMECHANGE:
      const newNameChange = { ...state };
      newNameChange.choosenNameFinal = action.payload;
      return newNameChange;
    case DESCRIPTIONCHANGE:
      const newDescriptionChange = { ...state };
      newDescriptionChange.choosenDescriptionFinal = action.payload;
      return newDescriptionChange;
    case CONNECTEDADDRESS:
      const newConnectedAddress = { ...state };
      newConnectedAddress.connectedAddress = action.payload;
      return newConnectedAddress;
    case PENDINGCONNECT:
      const newPendingConnect = { ...state };
      newPendingConnect.pendingConnect = action.payload;
      return newPendingConnect;
    case WEB3:
      const newWeb3 = { ...state };
      newWeb3.web3 = action.payload;
      return newWeb3;
    case HEXTONUMBER:
      const newHexToNumber = { ...state };
      newHexToNumber.hexToNumber = action.payload;
      return newHexToNumber;
    case GASPRICE:
      const newGasPrice = { ...state };
      newGasPrice.gasPrice = action.payload;
      return newGasPrice;
    case PRICETOMINT:
      const newPriceToMint = { ...state };
      newPriceToMint.priceToMint = action.payload;
      return newPriceToMint;
    case PRICETOMINTUSD:
      const newPriceToMintUsd = { ...state };
      newPriceToMintUsd.priceToMintUsd = action.payload;
      return newPriceToMintUsd;
    case TRANSACTIONHASH:
      const newTransactionHash = { ...state };
      newTransactionHash.transactionHash = action.payload;
      return newTransactionHash;
    case ISMINTING_ON:
      const newIsMintingOn = { ...state, ...action.payload };
      newIsMintingOn.isMinting = true;
      return newIsMintingOn;
    case ISMINTING_OFF:
      const newIsMintingOff = { ...state, ...action.payload };
      newIsMintingOff.isMinting = false;
      return newIsMintingOff;
    case DISCOUNT_APPLIED:
      const discountApplied = { ...state, ...action.payload };
      discountApplied.applied = false;
      return discountApplied;
    case ONCHAINORDER_TOGGLE:
      const newOnchainToggle = { ...state, ...action.payload };
      newOnchainToggle.onChainOrder = !newOnchainToggle.onChainOrder;
      return newOnchainToggle;
    case PINISCHECKED_TOGGLE:
      const newPinIsChecked = { ...state, ...action.payload };
      newPinIsChecked.pinIsChecked = action.payload;
      return newPinIsChecked;
    case BLACKLISTEDHEX:
      const newBlacklist = {
        ...state,
        blackListedHEX: [
          ...state.blackListedHEX,
          '#fff100',
          '#0F4240',
          '#000000',
          '#ffa500',
        ],
      };
      newBlacklist.blackListedHEX = newBlacklist.blackListedHEX.filter(
        (item) =>
          '#52565e' !== item &&
          '#ffffff' !== item &&
          '#404040' !== item &&
          '#e20074' !== item
      );
      return newBlacklist;
    case BLACKLISTEDNAME:
      const newBlacklistName = {
        ...state,
        blackListedNAME: [...state.blackListedNAME, 'nike', 'instaaa245'],
      };
      newBlacklistName.blackListedNAME =
        newBlacklistName.blackListedNAME.filter(
          (item) => 'javascript' !== item && 'instaaa' !== item
        );
      return newBlacklistName;
    default:
      return state;
  }
};

export default reducer;
