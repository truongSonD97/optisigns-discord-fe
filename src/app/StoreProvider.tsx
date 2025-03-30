"use client";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { InitApp } from "../components/initApp";
// import { checkoutNpConfig, categoryNpConfig, store } from "./redux/store";
// import PersistWrapper from 'next-persist/lib/NextPersistWrapper';


export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <Provider store={store}>
      <InitApp/>
        {/* <PersistWrapper wrapperConfig={categoryNpConfig}> */}
          {children}
        {/* </PersistWrapper> */}
    </Provider>
  );
}
