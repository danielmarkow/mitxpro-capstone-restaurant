import { useRouter } from "next/router";
import { api } from "../utils/api";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "next";
import superjson from "superjson";

import { appRouter } from "../server/api/root";
import { prisma } from "../server/db";

export async function getStaticProps(
  context: GetStaticPropsContext<{ restaurantId: string }>
) {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  });
  const restaurantId = context.params?.restaurantId as string;
  // prefetch `post.byId`
  await ssg.dishes.getDishes.prefetch({ restaurantId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      restaurantId,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dishes = await prisma.dish.findMany({
    select: {
      restaurantId: true,
    },
  });
  return {
    paths: dishes.map((dish) => ({
      params: {
        restaurantId: dish.restaurantId,
      },
    })),
    // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
    fallback: "true",
  };
};

export default function DishesList(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { restaurantId } = props;
  const dishes = api.dishes.getDishes.useQuery({ restaurantId });

  return (
    <>
      <h1>dishes list</h1>
      <p>resto: {restaurantId}</p>
      <p>{dishes.isSuccess && JSON.stringify(dishes.data)}</p>
    </>
  );
}
