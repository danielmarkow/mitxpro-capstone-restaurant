import Image from "next/image";
import Link from "next/link";

import type { Restaurant } from "../types/restaurantDish";
// import type { UseTRPCQueryResult } from "@trpc/react-query/shared";
// import { TRPCClientError } from "@trpc/client";

export default function RestaurantList({ restaurants }: { restaurants: any }) {
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          {restaurants.isSuccess &&
            restaurants.data.map((resto: Restaurant) => (
              <div key={resto.id} className="group relative">
                <div className="min-h-80 aspect-w-1 aspect-h-1 lg:aspect-none w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                  <Image
                    src={`/images/restaurants/${resto.image}`}
                    height={600}
                    width={450}
                    alt={`front of restaurant ${resto.name}`}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 mb-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/${resto.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {resto.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {resto.description}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Rating</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
