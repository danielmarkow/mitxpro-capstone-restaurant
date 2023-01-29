import { Fragment } from "react";

import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { Disclosure, Menu, Transition, Popover } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

import { api } from "../utils/api";

const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ");
};

export default function Navbar() {
  const { data: sessionData } = useSession();
  const utils = api.useContext();

  const cart = api.cart.getCart.useQuery(
    { userId: sessionData?.user?.id },
    {
      queryKey: ["cart", "getCart", sessionData],
    }
  );

  const migrateCartToOrders = api.order.createOrders.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });

  const checkoutMutation = api.checkout.createPayment.useMutation({
    onSuccess(data, variables, context) {
      console.log(data);
      window.location.assign(data.url);
      migrateCartToOrders.mutate({ userId: sessionData?.user?.id });
    },
  });

  const user = {
    name: sessionData?.user?.name,
    email: sessionData?.user?.email,
    imageUrl: sessionData?.user?.image,
  };

  return (
    <Disclosure as="nav" className="border-b border-gray-200 bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <Link href="/" className="flex flex-shrink-0 items-center">
                  Restaurants
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* Profile dropdown */}
                {sessionData ? (
                  <>
                    <p className="text-sm text-gray-400">
                      {sessionData.user?.email}
                    </p>
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={user.imageUrl}
                            alt={user.name}
                            height={600}
                            width={450}
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {
                            <>
                              <Menu.Item key={"User Profile"}>
                                {({ active }) => (
                                  <Link
                                    href={`/user/${sessionData.user?.id}`}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    User Profile
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item key={"Sign Out"}>
                                {({ active }) => (
                                  <a
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                    onClick={() => signOut()}
                                  >
                                    Sign Out
                                  </a>
                                )}
                              </Menu.Item>
                            </>
                          }
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    <div className="flex">
                      <div className="cursor-pointer">login to order</div>
                    </div>
                  </button>
                )}
                {/* Shopping cart dropdown */}
                <Popover className="z-50 ml-2 flow-root text-sm lg:relative lg:ml-4">
                  <Popover.Button className="group -m-2 mr-1 flex items-center p-2">
                    <ShoppingCartIcon
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {sessionData
                        ? cart.isSuccess &&
                          (cart.data.reduce((acc, item) => {
                            return acc + item.quantity;
                          }, 0) as any)
                        : 0}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Panel className="absolute inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg sm:px-2 lg:top-full lg:left-auto lg:right-0 lg:mt-3 lg:-mr-1.5 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5">
                      <h2 className="sr-only">Shopping Cart</h2>

                      {sessionData && cart.isSuccess && (
                        <form className="mx-auto max-w-2xl px-4">
                          <ul role="list" className="divide-y divide-gray-200">
                            {cart.isSuccess &&
                              cart.data.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex items-center py-6"
                                >
                                  <Image
                                    src={`/images/dishes/${item.dish.image}`}
                                    alt={`image of dish ${item.dish.name}`}
                                    height={600}
                                    width={450}
                                    className="h-16 w-16 flex-none rounded-md border border-gray-200"
                                  />
                                  <div className="ml-4 flex-auto">
                                    <h3 className="font-medium text-gray-900">
                                      {item.dish.name}
                                    </h3>
                                    <p className="text-gray-500">
                                      {item.dish.description} x {item.quantity}
                                    </p>
                                  </div>
                                </li>
                              ))}
                          </ul>
                          <button
                            type="submit"
                            className="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            onClick={(e) => {
                              e.preventDefault();
                              checkoutMutation.mutate({
                                userId: sessionData?.user?.id,
                              });
                            }}
                          >
                            Checkout
                          </button>

                          <p className="mt-6 text-center">
                            <Link
                              href="/cart"
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              View Shopping Cart
                            </Link>
                          </p>
                        </form>
                      )}
                      {!sessionData && (
                        <p className="mt-1 ml-1 text-sm text-gray-400">
                          log in to view cart
                        </p>
                      )}
                    </Popover.Panel>
                  </Transition>
                </Popover>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                {sessionData && (
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-full"
                      height={600}
                      width={450}
                      src={user.imageUrl}
                      alt={`image of ${user.name}`}
                    />
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {sessionData ? (
                  <>
                    <Disclosure.Button
                      key={"User Profile"}
                      as="a"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      <Link href={`/user/${sessionData.user?.id}`}>
                        User Profile
                      </Link>
                    </Disclosure.Button>
                    <Disclosure.Button
                      key={"Sign Out"}
                      as="a"
                      onClick={() => signOut()}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign Out
                    </Disclosure.Button>
                  </>
                ) : (
                  <Disclosure.Button
                    key={"Sign In"}
                    as="a"
                    onClick={() => signIn()}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign In
                  </Disclosure.Button>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
