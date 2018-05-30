// @flow
import {
  UPDATE_ASSET,
  UPDATE_ASSETS,
  UPDATE_ASSETS_STATE,
  ADD_ASSET,
  REMOVE_ASSET,
  UPDATE_ASSETS_BALANCES,
  SET_INITIAL_ASSETS,
  FETCHED,
  FETCHED_INITIAL,
} from 'constants/assetsConstants';
import { transformAssetsToObject } from 'utils/assets';
import merge from 'lodash.merge';

export type AssetsReducerState = {
  data: Object,
  assetsState: ?string,
};

export type AssetsReducerAction = {
  type: string,
  payload: any,
};

const initialState = {
  data: {},
  assetsState: null,
};

export default function assetsReducer(
  state: AssetsReducerState = initialState,
  action: AssetsReducerAction,
) {
  switch (action.type) {
    case UPDATE_ASSETS_STATE:
      return { ...state, assetsState: action.payload };
    case UPDATE_ASSET:
      const { symbol } = action.payload;
      const updatedState = {
        data: { [symbol]: { ...state.data[symbol], ...action.payload } },
      };
      return merge(
        {},
        state,
        updatedState,
      );
    case UPDATE_ASSETS:
      return { ...state, data: action.payload, assetsState: FETCHED };
    case ADD_ASSET:
      const addedAsset = action.payload;
      return merge({}, state, { data: { [addedAsset.symbol]: { ...addedAsset } } });
    case REMOVE_ASSET:
      const removedAsset = action.payload;
      const clonedState = merge({}, state);
      // better to use reduce to filter out and remove the key from the object
      delete clonedState.data[removedAsset.symbol];
      return { ...clonedState };
    case SET_INITIAL_ASSETS:
      return { ...state, data: action.payload || {}, assetsState: FETCHED_INITIAL };
    case UPDATE_ASSETS_BALANCES:
      const mappedAssets = transformAssetsToObject(action.payload);
      return merge(
        {},
        state,
        { assetsState: FETCHED },
        { data: mappedAssets },
      );
    default:
      return state;
  }
}