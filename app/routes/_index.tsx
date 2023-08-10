import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";
import banner from "../../public/banner.jpg";
export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <header className=" w-full  h-20 border-b-2 border-yellow-100 flex  justify-end content-center  px-3 ">
        {user ? (
          <Link
            to="/properties"
            className="  flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
          >
            View Properties for {user.email}
          </Link>
        ) : (
          <div className=" flex  justify-center font-semibold  text-xl  items-center ">
            <Link
              to="/join"
              className="   bg-yellow-100 py-3 px-5 rounded-md  h-12 hover:bg-yellow-300 "
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className=" ml-3 bg-yellow-50 py-3 px-5 rounded-md hover:bg-yellow-200   h-12"
            >
              Log In
            </Link>
          </div>
        )}
      </header>
      <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
        <div className="relative sm:pb-16  sm:pt-16">
          <div className="mx-auto max-w-[90%] sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
              <div className="absolute inset-0">
                <img
                  className="h-full w-full object-cover"
                  src={banner}
                  alt="an air view of a residential area"
                />
                <div className="absolute inset-0 bg-[color:rgba(27,167,254,0.2)] mix-blend-multiply" />
              </div>
              <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
                <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                  <span className="block uppercase text-yellow-200 drop-shadow-md">
                    Malaga Properties
                  </span>
                </h1>

                <div className="mx-auto mt-10 mb-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                  <Form method="post" className=" mt-10 w-[40%]">
                    <div className="relative">
                      <div className=" cursor-pointer  absolute flex justify-center items-center    bg-yellow-500 h-full z-10 rounded-bl-sm rounded-tl-sm w-14  bottom-50 left-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke=" white "
                          className=" stroke-yellow-100    hover:stroke-white stroke-4 w-6 h-6 hover:w-7 hover:h-7 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        className=" h-10 w-[100%] rounded-md drop-shadow-md outline-none pl-16"
                      />
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
