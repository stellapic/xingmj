import { createStore, Reducer } from "redux";

export type stateType = {
  userToken: string | null;
};

const initState: stateType = {
  userToken: localStorage.getItem("userToken"),
};

const reducer: Reducer = (preState: stateType = initState, action) => {
  const { type, data } = action;
  switch (type) {
    case "setToken":
      return { userToken: data };
    default:
      return preState;
  }
};

export default createStore(reducer);
