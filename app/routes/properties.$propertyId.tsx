import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { ClientOnly } from "remix-utils";
import invariant from "tiny-invariant";
import { AddressMinimap } from "~/components/mapbox.client";
import { deleteProperty, getProperty } from "~/models/properties.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  if (!userId) {
    return redirect("/login");
  }
  invariant(params.propertyId, "propertyId  not found");

  const property = await getProperty({ id: params.propertyId });

  invariant(property?.id, "propertyId  not found");

  const MAPBOX_ACCES_TOKEN = process.env.MAPBOX_ACCES_TOKEN;

  invariant(MAPBOX_ACCES_TOKEN, "Acces token not found");

  const res = await fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?q=${property.geoCode}&proximity=ip&access_token=${MAPBOX_ACCES_TOKEN}`,
  );

  const data = await res.json();

  invariant(data.features, "Acces token not found");
  invariant(data.features[0], "Acces token not found");
  const feature = data.features[0];

  return json({
    property,
    ENV: { MAPBOX_ACCES_TOKEN },
    feature,
  });
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);

  if (!userId) {
    return redirect("/login");
  }

  invariant(params.propertyId, "propertyId  not found");

  const property = await getProperty({ id: params.propertyId });

  if (userId !== property?.userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  await deleteProperty({ id: params.propertyId });

  return redirect("/properties");
};

export default function PropertyDetailsPage() {
  const data = useLoaderData<typeof loader>();

  const [marketPrice, setMarketPrice] = useState(() => {
    return (
      (data.property.garage ? 5000 : 0) +
      data.property.ownerPrice +
      (data.property.ownerPrice / 100) * data.property.agencyFee.fee
    );
  });

  useEffect(() => {
    setMarketPrice(() => {
      return (
        (data.property.garage ? 5000 : 0) +
        data.property.ownerPrice +
        (data.property.ownerPrice / 100) * data.property.agencyFee.fee
      );
    });
  }, [
    data.property.ownerPrice,
    data.property.agencyFee.fee,
    data.property.garage,
  ]);

  return (
    <>
      <div>
        <div className="">
          <img
            src={data.property.imgs[0].url}
            alt={data.property.imgs[0].alt}
            className="  w-[30%]  shadow-md rounded-sm"
          />
        </div>

        <h3 className="text-2xl font-bold pb-1">{data.property.title}</h3>
        <div className="py-1 flex ">
          <p className="">{data.property.country},</p>
          <p className="ml-2">{data.property.state},</p>
          <p className="ml-2">{data.property.city},</p>
          <p className="ml-2"> pc {data.property.cp},</p>
          <p className="ml-2">
            {data.property.address1}
            {data.property.address2 ? "," : ""}
          </p>
          <p className="ml-2">{data.property.address2}</p>
        </div>
        <div className="py-1 flex ">
          <p>{data.property.bedrooms} bed, </p>
          <p className="ml-2">{data.property.bathroom} bath, </p>
          <p className="ml-2">
            {data.property.size} m² {data.property.garage ? "," : void 0}
          </p>
          {data.property.garage ? <p className="ml-2">Garage</p> : void 0}
        </div>
        <div className="py-1">
          <p>Phone {data.property.phone}</p>
        </div>
        <div className="py-1 flex ">
          <p>Owner Price: {data.property.ownerPrice}€,</p>{" "}
          <p className="ml-2">Market Price: {marketPrice}€</p>
        </div>
        <p className="pt-2 pb-3">{data.property.description}</p>
        <ClientOnly fallback={void 0}>
          {() => (
            <div id="minimap-container" className="  h-64  w-60  mt18">
              {/* 
// @ts-ignore */}
              <AddressMinimap
                accessToken={data.ENV.MAPBOX_ACCES_TOKEN}
                show
                feature={data.feature}
              ></AddressMinimap>
            </div>
          )}
        </ClientOnly>
        <hr className="my-4" />
        <div className="flex justify-end  ">
          <Form method="post">
            <button
              type="submit"
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400 "
            >
              Delete
            </button>
          </Form>
          <Link to={`/properties/update/${data.property.id}`}>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 mx-10 "
            >
              Update
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>property not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
