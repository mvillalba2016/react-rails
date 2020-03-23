import { useContext, createContext } from "react";
import { types, Instance, onSnapshot } from "mobx-state-tree";
import { PostList } from "./PostList";

const RootModel = types.model({
  postList: PostList
});

export const rootStore = RootModel.create({
  postList: { items: [], loading: false, error: false, apiCalled: false }
});

onSnapshot(rootStore, snapshot => console.log("Snapshot: ", snapshot));

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;
export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }

  return store;
}