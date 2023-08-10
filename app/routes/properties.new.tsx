import { useForm } from "@conform-to/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import validator from "validator";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { createProperty } from "~/models/properties.server";
import { requireUserId } from "~/session.server";
// import { useConfirmAddress, config } from "~/components/mapbox.client";
import { useCallback, useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { ClientOnly } from "remix-utils";

const schema = z.object({
  phone: z.string().max(40).min(1).refine(validator.isMobilePhone),
  country: z.string().trim().max(40).min(1),
  address1: z.string().trim().max(120).min(1),
  address2: z.string().trim().max(120),
  cp: z
    .string()
    .max(40)
    .min(1)
    .refine((cp) => validator.isPostalCode(cp, "ES")),
  city: z.string().trim().max(40).min(1),
  state: z.string().trim().max(40).min(1),
  bedrooms: z.coerce.number().min(1),
  garage: z.coerce.boolean(),
  ownerPrice: z.coerce.number().min(1),
  title: z.string().trim().max(40).min(1),
  size: z.coerce.number().min(1),
  description: z.string().trim().max(40).min(1),
  bathroom: z.string().refine(validator.isNumeric).transform(Number),
});

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  if (!userId) {
    return redirect("/login");
  }
  invariant(process.env.MAPBOX_ACCES_TOKEN, "Acces token not found");
  return json(
    { ENV: { MAPBOX_ACCES_TOKEN: process.env.MAPBOX_ACCES_TOKEN } },
    { status: 200 },
  );
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  if (!userId) {
    return redirect("/login");
  }

  const formData = await request.formData();

  const submission = parse(formData, { schema });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }
  const {
    phone,
    country,
    address1,
    address2,
    cp,
    city,
    state,
    bedrooms,
    garage,
    ownerPrice,
    title,
    size,
    description,
    bathroom,
  } = submission.value;

  // const address = [address1, address2, cp, city, country].reduce((acc, cv) => {
  //   return cv ? acc + " , " + cv : acc;
  // });
  // console.log({ address });
  // const res = await fetch(
  //   `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAPBOX_ACCES_TOKEN}`,
  // );

  // const data = await res.json();
  // if (!data.features[0]) {
  //   return json(
  //     {
  //       ...submission,
  //       error: {
  //         geolocation: "Oops! Something went wrong.",
  //       },
  //     },
  //     { status: 400 },
  //   );
  // }

  // const location = data.features.find((res: any) =>
  //   res.context.find((ctx: any) => ctx.id === "region.386118"),
  // );

  // if (!location) {
  //   return json(
  //     {
  //       ...submission,
  //       error: {
  //         geolocation: "the address is not on the Málaga region",
  //       },
  //     },
  //     { status: 400 },
  //   );
  // }

  // console.log({ location });

  // console.log({ data });
  const geoCode = "";

  const note = await createProperty({
    phone,
    country,
    address1,
    address2,
    cp,
    city,
    state,
    bedrooms,
    garage,
    ownerPrice,
    title,
    size,
    description,
    bathroom,
    userId,
    geoCode,
  });

  return redirect(`/properties/${note.id}`);
};

export default function NewPropertyPage() {
  const data = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const [
    form,
    {
      phone,
      country,
      address1,
      address2,
      cp,
      city,
      state,
      bedrooms,
      garage,
      ownerPrice,
      title,
      size,
      description,
      bathroom,
    },
  ] = useForm({
    lastSubmission,
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  // const [showFormExpanded, setShowFormExpanded] = useState(false);
  // const [showMinimap, setShowMinimap] = useState(false);
  // const [feature, setFeature] = useState();
  // const [showValidationText, setShowValidationText] = useState(false);
  // const [token, setToken] = useState(data.ENV.MAPBOX_ACCES_TOKEN);

  // useEffect(() => {
  //   setToken(data.ENV.MAPBOX_ACCES_TOKEN);
  //   config.accessToken = data.ENV.MAPBOX_ACCES_TOKEN;
  // }, [data.ENV.MAPBOX_ACCES_TOKEN]);

  // const { formRef, showConfirm } = useConfirmAddress({
  //   minimap: true,
  // });

  // const handleRetrieve = useCallback(
  //   (res: any) => {
  //     const feature = res.features[0];
  //     setFeature(feature);
  //     setShowMinimap(true);
  //     setShowFormExpanded(true);
  //   },
  //   [setFeature, setShowMinimap],
  // );

  // function handleSaveMarkerLocation(coordinate: any) {
  //   console.log(`Marker moved to ${JSON.stringify(coordinate)}.`);
  // }

  // const handleSubmit = useCallback(
  //   async (e) => {
  //     e.preventDefault();
  //     const result = await showConfirm();
  //     if (result.type === "nochange") submitForm();
  //   },
  //   [showConfirm],
  // );

  // function submitForm() {
  //   setShowValidationText(true);
  //   setTimeout(() => {
  //     resetForm();
  //   }, 2500);
  // }

  // function resetForm() {
  //   // const inputs = document.querySelectorAll("input");
  //   // inputs.forEach((input) => (input.value = ""));
  //   setShowFormExpanded(false);
  //   setShowValidationText(false);
  // }

  return (
    <Form
      method="post"
      {...form.props}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex justify-center items-center mb-14"
    >
      <div className="w-[70%]">
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Title: </span>
            <input
              name={title.name}
              type="text"
              className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none"
            />
            <div className="  text-red-500 ">{title.error}</div>
          </label>
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Description: </span>
            <textarea
              name={description.name}
              rows={8}
              className="w-full flex-1 rounded-md border-2 focus:border-blue-500 border-gray-600  px-3 py-2 text-lg leading-6"
            />
            <div className="  text-red-500 ">{description.error}</div>
          </label>
        </div>
        <div className="flex justify-between">
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>
                Size (m<sup>2</sup>):{" "}
              </span>
              <input
                type="number"
                name={size.name}
                className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
              />
              <div className="  text-red-500 ">{size.error}</div>
            </label>
          </div>
          <div>
            <label className="flex w-full flex-col gap-1">
              <span> Bedrooms: </span>
              <input
                name={bedrooms.name}
                type="number"
                className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
              />
              <div className="  text-red-500 ">{bedrooms.error}</div>
            </label>
          </div>
          <div>
            <label className="flex w-full flex-col gap-1">
              <span> Bathroom: </span>
              <input
                name={bathroom.name}
                type="number"
                className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
              />
              <div className="  text-red-500 ">{bathroom.error}</div>
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Country: </span>
              <input
                name={country.name}
                className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
              />
              <div className="  text-red-500 ">{country.error}</div>
            </label>
          </div>
          <div>
            <label className="flex w-full flex-col gap-1">
              <span> Cp: </span>
              <input
                name={cp.name}
                className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
              />
              <div className="  text-red-500 ">{cp.error}</div>
            </label>
          </div>
          <div>
            <label className="flex w-full flex-col gap-1">
              <span> City: </span>
              <input
                name={city.name}
                className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
              />
              <div className="  text-red-500 ">{city.error}</div>
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <label className="flex w-full flex-col gap-1">
              <span> State: </span>
              <input
                name={state.name}
                className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
              />
              <div className="  text-red-500 ">{state.error}</div>
            </label>
          </div>
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Phone: </span>
              <input
                name={phone.name}
                className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
              />
              <div className="  text-red-500 ">{phone.error}</div>
            </label>
          </div>
        </div>
        <div>
          <label className="flex  items-start w-full flex-col gap-1 ">
            <span> Garage: </span>
            <input
              name={garage.name}
              type="checkbox"
              className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
            />
            <div className="  text-red-500 ">{garage.error}</div>
          </label>
        </div>
        <div>
          <label className="flex w-full flex-col gap-1">
            <span> Address Line 1 : </span>
            {/* <ClientOnly
              fallback={
                <input
                  className="input mb12"
                  placeholder="Start typing your address, e.g. 123 Main..."
                  autoComplete="address-line1"
                  id="mapbox-autofill"
                />
              }
            >
              {() => (
                <mapbox-address-autofill
                  accessToken={token}
                  onRetrieve={handleRetrieve}
                >
                  <input
                    className="input mb12"
                    placeholder="Start typing your address, e.g. 123 Main..."
                    autoComplete="address-line1"
                    id="mapbox-autofill"
                  />
                </mapbox-address-autofill>
              )}
            </ClientOnly> */}

            <div className="  text-red-500 ">{address1.error}</div>
          </label>
        </div>
        <div>
          <label className="flex w-full flex-col gap-1">
            <span> Address Line 2 : </span>
            <input
              name={address2.name}
              className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
            />
            <div className="  text-red-500 ">{address2.error}</div>
          </label>
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>OwnerPrice : </span>
            <input
              name={ownerPrice.name}
              type="number"
              className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden appearance-none  "
            />
            <div className="  text-red-500 ">{ownerPrice.error}</div>
          </label>
        </div>

        <div className="text-right mt-2">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save
          </button>
        </div>
        <div id="minimap-container" className="h240 w360 relative mt18">
          {/* <ClientOnly fallback={void 0}>
            {() => (
              <mapbox-address-minimap
                canAdjustMarker={true}
                satelliteToggle={true}
                feature={feature}
                show={showMinimap}
                onSaveMarkerLocation={handleSaveMarkerLocation}
              />
            )}
          </ClientOnly> */}
        </div>
      </div>
    </Form>
  );
}
