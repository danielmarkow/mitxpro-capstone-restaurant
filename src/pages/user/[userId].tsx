import Image from "next/image";
import { useSession } from "next-auth/react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";

import { api } from "../../utils/api";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

export default function UserProfile() {
  const { data: sessionData } = useSession();

  const orderQuery = api.order.getOrders.useQuery({
    userId: sessionData?.user?.id,
  });
  if (sessionData) {
    return (
      <div className="bg-white">
        <div className="mx-auto mt-1 max-w-2xl border py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <Image
            className="h-300 w-225 mb-3 "
            // TODO add default user profile image
            src={sessionData.user?.image}
            alt={sessionData.user?.name}
            height={150}
            width={112}
          />

          <div className="text-xl">user profile - {sessionData.user?.name}</div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            order history
          </h1>
          <br />
          <div>
            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {orderQuery.isSuccess &&
                orderQuery.data.map((order, i) => (
                  <li key={i} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <Image
                        src={`/images/dishes/${order.dish.image}`}
                        alt={`image of dish ${order.dish.name}`}
                        height={600}
                        width={450}
                        className="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"
                      />
                    </div>
                    <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div>
                        <div className="flex justify-between sm:grid sm:grid-cols-2">
                          <div className="pr-6">
                            <h3 className="text-sm">
                              <p className="font-medium text-gray-700 hover:text-gray-800">
                                {order.dish.name}
                              </p>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {order.quantity} x € {order.price}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              ordered {dayjs(order.createdAt).fromNow()} ago
                            </p>
                          </div>
                          <p className="text-right text-sm font-medium text-gray-900">
                            € {order.quantity * order.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          please log in
        </div>
      </div>
    );
  }
}
