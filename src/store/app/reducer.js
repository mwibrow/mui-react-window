import Immutable from "seamless-immutable";

import actions from "./actions";

const initialState = Immutable({
  data: [],
  hasMoreData: true,
  loadingData: false
});

const reduce = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case actions.LOADING_DATA: {
      return state.merge(payload);
    }
    case actions.DATA_FETCHED: {
      return state.merge(payload);
    }
    default:
      return state;
  }
};

const getData = state => state.app.data;
const getLoadingData = state => state.app.loadingData;
const getHasMoreData = state => state.app.hasMoreData;
export { reduce as default, getData, getLoadingData, getHasMoreData };
