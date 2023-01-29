import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import Navbar from "../components/Navbar";

import { Toaster } from "react-hot-toast";

import "../styles/globals.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
