import Image from "next/image";

import { api } from "../utils/api";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "next";
import superjson from "superjson";

import { appRouter } from "../server/api/root";
import { prisma } from "../server/db";

import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import SearchBar from "../components/common/SearchBar";

export async function getStaticProps(
  context: GetStaticPropsContext<{ restaurantId: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma: prisma },
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
    fallback: true,
  };
};

export default function DishesList(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [dishName, setDishName] = useState("");
  const utils = api.useContext();

  const { restaurantId } = props;
  const dishes = api.dishes.getDishes.useQuery(
    { restaurantId },
    {
      select: (dishes) => {
        if (dishName === "") {
          return dishes;
        }
        return dishes.filter((d) =>
          d.name.toLocaleLowerCase().includes(dishName.toLowerCase())
        );
      },
    }
  );

  const { data: sessionData } = useSession();
  const addOneToCartMutation = api.cart.addOne.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate().catch((error) => console.log(error));
      toast.success("successfully added dish to cart");
    },
  });

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-8 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
          <SearchBar
            value={dishName}
            setValue={setDishName}
            placeholder={"search dishes"}
          />
          {dishes.isSuccess && (
            <>
              <h2 className="text-xl font-bold text-gray-900">
                Dishes at {dishes?.data[0]?.restaurant.name}
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                {dishes.data.map((dish) => (
                  <div key={dish.stripe_api_id}>
                    <div className="relative">
                      <div className="relative h-72 w-full overflow-hidden rounded-lg">
                        <Image
                          src={`/images/dishes/${dish.image}`}
                          height={600}
                          width={450}
                          alt={`picture of dish ${dish.name}`}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="relative mt-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {dish.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {dish.description}
                        </p>
                      </div>
                      <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                        />
                        <p className="relative text-lg font-semibold text-white">
                          {dish.price}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() =>
                          addOneToCartMutation.mutate({
                            userId: sessionData?.user?.id,
                            dishId: dish.stripe_api_id,
                          })
                        }
                        className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 py-2 px-8 text-sm font-medium text-gray-900 hover:bg-gray-200"
                      >
                        Add to bag
                        <span className="sr-only">, {dish.name}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
