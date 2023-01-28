import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";

import RestaurantList from "../components/RestaurantList";

const Home: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>Restaurants App</title>
        <meta
          name="order food form restaurants"
          content="Generated by create-t3-app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <RestaurantList />
        </div>
      </main>
    </>
  );
};

export default Home;
