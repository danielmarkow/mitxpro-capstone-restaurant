import { useRouter } from "next/router";
import { api } from "../utils/api";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";

import { appRouter } from "../server/api/root";
import { createContext } from "../server/api/trpc";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ restaurantId: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const restaurantId = context.params?.restaurantId as string;

  await ssg.dishes.getDishes.prefetch({ restaurantId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      restaurantId,
    },
  };
}

export default function DishesList(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  console.log(props);
  // const router = useRouter();
  // const { restaurantId } = router.query;
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
