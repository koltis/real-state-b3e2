import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";

import { useOptionalUser } from "~/utils";
import banner from "../../public/banner.jpg";
import { getProperties } from "~/models/properties.server";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const urlPage = +(url.searchParams.get("page") ?? "0").replace(
    /[^a-zA-Z0-9., ]/g,
    "",
  );

  const { next, prev, properties, page } = await getProperties({
    page: urlPage,
  });

  return json({ next, prev, properties, page });
};

export default function Index() {
  const user = useOptionalUser();
  const data = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();

  return (
    <>
      <header className=" w-full  h-20 border-b-2 border-yellow-100 flex  justify-center  sm:justify-end content-center  sm:px-3 ">
        {user ? (
          <Link
            to="/properties"
            className=" text-center  flex items-center justify-center  border border-transparent bg-white  px-2 sm:px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 "
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
              className=" ml-3 bg-yellow-50 py-3 px-5 rounded-md hover:bg-yellow-200  h-12"
            >
              Log In
            </Link>
          </div>
        )}
      </header>
      <main className="relative min-h-screen bg-white flex  flex-col items-center justify-center">
        <div className="relative pb-8 pt-8 sm:pb-16  sm:pt-16 w-full">
          <div className="mx-auto sm:max-w-[90%] sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
              <div className="absolute inset-0">
                <img
                  className="h-full w-full object-cover"
                  src={banner}
                  alt="an air view of a residential area"
                />
                <div className="absolute inset-0 bg-[color:rgba(27,167,254,0.2)] mix-blend-multiply" />
              </div>
              <div className="relative px-4 pb-8 pt-16  md:px-6 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
                <h1 className="text-center  text-5xl  md:text-8xl  font-extrabold tracking-tight sm:text-6xl lg:text-9xl">
                  <span className="block uppercase text-yellow-200 drop-shadow-md">
                    Malaga Properties
                  </span>
                </h1>

                <div className="mx-auto my-5 md:my-10 max-w-sm flex sm:max-w-none  justify-center">
                  <Form
                    method="post"
                    className=" mt-10  md:w-[50%]  lg:w-[40%] w-[90%]"
                  >
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
        <div className=" w-[90%] flex justify-center flex-col  items-center  ">
          <h3 className="  text-3xl sm:text-4xl  md:text-6xl font-extrabold uppercase text-blue-300 drop-shadow-md text-center ">
            Our property selection
          </h3>
          <div className="mt-10 flex    justify-center flex-wrap gap-6  mb-10 w-[80%]">
            {data.properties
              ? data.properties.map((property) => {
                  return (
                    <div
                      key={property.id}
                      className=" w-80 border-2 border-blue-100 rounded-sm mt-2 flex flex-col justify-between "
                    >
                      <img
                        className=" h-56  w-80 object-cover rounded-sm rounded-b-none "
                        src={property.imgs[0].url}
                        alt={property.imgs[0].alt}
                      />
                      <div className="p-3 ">
                        <div className=" font-semibold text-lg  break-words my-2 ">
                          {property.title}
                        </div>
                        <div className="    text-base break-words my-2 ">
                          {property.address1}
                          {property.address2 ? ", " + property.address2 : " "} ,
                          {property.cp}, {property.state}, {property.country}
                        </div>
                        <div className="    text-base break-words my-2 ">
                          {property.size} m² / Garage:{" "}
                          {property.garage ? "yes" : "no"}
                        </div>
                        <div className="    text-base break-words my-2 ">
                          {property.bedrooms} bedroom
                          {property.bedrooms > 1 ? "s" : ""} /{" "}
                          {property.bathroom} bathroom
                          {property.bathroom > 1 ? "s" : ""}
                        </div>
                        <div className=" font-medium text-base break-words my-2 ">
                          Price{" "}
                          {(property.garage ? 5000 : 0) +
                            property.ownerPrice +
                            (property.ownerPrice / 100) *
                              property.agencyFee.fee}{" "}
                          €
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="rounded-sm rounded-t-none px-4 py-2   font-semibold  text-black hover:bg-yellow-200 active:bg-yellow-400 "
                      >
                        More
                      </button>
                    </div>
                  );
                })
              : void 0}
          </div>
          {data.properties ? (
            <div className="mb-10 flex justify-center items-center">
              <Form method="get">
                {Array.from(searchParams.entries()).map(([key, value]) => {
                  return (
                    <>
                      {key === "page" ? (
                        void 0
                      ) : (
                        <input
                          key={key}
                          id={key}
                          name={key}
                          value={value}
                          type="hidden"
                        />
                      )}
                    </>
                  );
                })}
                <input
                  id="page"
                  name="page"
                  value={data.page <= 0 ? 0 : data.page - 1}
                  type="hidden"
                />
                <button
                  type="submit"
                  disabled={data.prev ? false : true}
                  className={`rounded-sm rounded-t-none px-4 py-2  ${
                    data.prev
                      ? "bg-yellow-200  hover:bg-yellow-300 active:bg-yellow-400"
                      : ""
                  } font-semibold  text-black  `}
                >
                  prev
                </button>
              </Form>

              <p className="mx-3 font-semibold text-lg">{data.page}</p>
              <Form method="get">
                {Array.from(searchParams.entries()).map(([key, value]) => {
                  return (
                    <>
                      {key === "page" ? (
                        void 0
                      ) : (
                        <input
                          key={key}
                          id={key}
                          name={key}
                          value={value}
                          type="hidden"
                        />
                      )}
                    </>
                  );
                })}
                <input
                  id="page"
                  name="page"
                  value={data.next ? data.page + 1 : data.page}
                  type="hidden"
                />
                <button
                  type="submit"
                  disabled={data.next ? false : true}
                  className={`rounded-sm rounded-t-none px-4 py-2  ${
                    data.next
                      ? "bg-yellow-200  hover:bg-yellow-300 active:bg-yellow-400"
                      : ""
                  } font-semibold  text-black  `}
                >
                  next
                </button>
              </Form>
            </div>
          ) : (
            void 0
          )}
        </div>
      </main>
    </>
  );
}
