import Image from "next/image";
import { useSession } from "next-auth/react";

import { api } from "../../utils/api";

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
          <div className="flex justify-between">
            <div className="text-xl">
              user profile - {sessionData.user?.name}
            </div>
            <div className="text-sm text-gray-500">member since 2022-12-12</div>
          </div>
          {orderQuery.isSuccess && JSON.stringify(orderQuery.data)}
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
