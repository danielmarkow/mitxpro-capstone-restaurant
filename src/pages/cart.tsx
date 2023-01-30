import Image from "next/image";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

import { api } from "../utils/api";

export default function Cart() {
  const { data: sessionData } = useSession();
  // TODO same query as in Navbar popout - maybe put in a context?
  const cart = api.cart.getCart.useQuery(
    { userId: sessionData?.user?.id as string },
    { enabled: !!sessionData }
  );
  // TODO same mutations used in multiple places - maybe put in a context?
  const utils = api.useContext();

  const addOneToCartMutation = api.cart.addOne.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate().catch((error) => console.log(error));
      toast.success("successfully added dish to cart");
    },
  });

  const removeOneFromCartMutation = api.cart.removeOne.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate().catch((error) => console.log(error));
      toast.success("removed item from cart");
    },
  });

  const deleteDishFromCartMutation = api.cart.deleteItem.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate().catch((error) => console.log(error));
      toast.success("deleted dish from cart");
    },
  });

  const migrateCartToOrders = api.order.createOrders.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });

  const checkoutMutation = api.checkout.createPayment.useMutation({
    onSuccess(data) {
      window.location.assign(data.url as string);
      migrateCartToOrders.mutate({ userId: sessionData?.user?.id });
    },
  });

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-4xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            shopping cart
          </h1>
          <form className="mt-12">
            <div>
              <h2 className="sr-only">items in your shopping cart</h2>

              <ul
                role="list"
                className="divide-y divide-gray-200 border-t border-b border-gray-200"
              >
                {cart.isSuccess &&
                  cart.data.map((item) => (
                    <li key={item.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <Image
                          src={`/images/dishes/${item.dish.image}`}
                          alt={`image of dish ${item.dish.name}`}
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
                                  {item.dish.name}
                                </p>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.dish.description}
                              </p>
                            </div>

                            <p className="text-right text-sm font-medium text-gray-900">
                              {item.dish.price}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center sm:absolute sm:top-0 sm:left-1/2 sm:mt-0 sm:block">
                            <p className="text-right text-sm font-medium text-gray-900">
                              {item.quantity} x
                            </p>
                            <div className="mt-2 flex justify-end gap-1">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  addOneToCartMutation.mutate({
                                    userId: sessionData?.user?.id,
                                    dishId: item.dish.stripe_api_id,
                                  });
                                }}
                              >
                                <PlusCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeOneFromCartMutation.mutate({
                                    userId: sessionData?.user?.id,
                                    dishId: item.dish.stripe_api_id,
                                  });
                                }}
                              >
                                <MinusCircleIcon className="h-5 w-5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:ml-0 sm:mt-3"
                              onClick={(e) => {
                                e.preventDefault();
                                deleteDishFromCartMutation.mutate({
                                  userId: sessionData?.user?.id,
                                  dishId: item.dish.stripe_api_id,
                                });
                              }}
                            >
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            {/* Order summary */}
            <div className="mt-10 sm:ml-32 sm:pl-6">
              <div className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
                <h2 className="sr-only">order summary</h2>

                <div className="flow-root">
                  <dl className="-my-4 divide-y divide-gray-200 text-sm">
                    <div className="flex items-center justify-between py-4">
                      <dt className="text-base font-medium text-gray-900">
                        order total
                      </dt>
                      {/* TODO make sure this works with zero items */}
                      <dd className="text-base font-medium text-gray-900">
                        $
                        {cart.isSuccess &&
                          cart.data.reduce((acc, item) => {
                            return acc + item.quantity * item.dish.price;
                          }, 0)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  onClick={(e) => {
                    e.preventDefault();
                    checkoutMutation.mutate({ userId: sessionData?.user?.id });
                  }}
                >
                  checkout
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  or
                  <Link
                    href="/"
                    className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    continue shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
