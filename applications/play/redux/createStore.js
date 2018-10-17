// @flow
import { applyMiddleware, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { middlewares as coreMiddlewares } from "@nteract/core";

import epics from "./epics";
import reducer from "./reducer";
import getInitialState from "./getInitialState";
import merge from "deepmerge";

/**
 * Not that we need to here, but I thought I'd write it out
type State = {
  ui: {
    repo: string,
    gitref: string,
    source: string,
    showPanel: boolean,
    currentServerId: string,
    currentKernelName: string,
    platform: string
  },
  entities: {
    serversById: *
  }
};
**/

export default function(givenInitialState: Object = {}) {
  const initialState = merge(getInitialState(), givenInitialState);
  const epicMiddleware = createEpicMiddleware<redux$Action, *, *, *>();
  const composeEnhancers =
    (typeof window !== "undefined" &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware<any, redux$Action, *>(
        epicMiddleware,
        coreMiddlewares.errorMiddleware
      )
    )
  );
  epicMiddleware.run(epics);
  return store;
}
