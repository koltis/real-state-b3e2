import { conform, useForm } from "@conform-to/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import validator from "validator";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { createProperty } from "~/models/properties.server";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { AddressMinimap, AddressAutofill } from "~/components/mapbox.client";
import { ClientOnly } from "remix-utils";
import { useRef, useState } from "react";

const schema = z.object({
  phone: z.string().max(40).min(1).refine(validator.isMobilePhone),
  country: z.string().trim().max(40).min(1),
  address1: z.string().trim().max(140).min(1),
  address2: z.string().trim().max(140),
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
  title: z.string().trim().max(65).min(1),
  size: z.coerce.number().min(1),
  description: z.string().trim().max(540).min(1),
  bathroom: z.string().refine(validator.isNumeric).transform(Number),
  geoCode: z.string().trim().min(1),
  img: z
    .instanceof(File, { message: "Img is required" })
    .refine((file) => file.size < 10000024, "File size must be less than 10mb"),
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
    geoCode,
    img,
  } = submission.value;

  const res = await fetch(
    ` https://api.mapbox.com/search/geocode/v6/forward?q=${geoCode}&proximity=ip&access_token=${process.env.MAPBOX_ACCES_TOKEN}`,
  );

  const data = await res.json();
  if (!data.features) {
    submission.error["geoLocation"] = "Oops! Something went wrong.";
    return json(submission, { status: 400 });
  }

  if (!data.features[0]) {
    submission.error["geoLocation"] = "Oops! Something went wrong.";
    return json(submission, { status: 400 });
  }
  if (!data.features[0].properties) {
    submission.error["geoLocation"] = "Oops! Something went wrong.";
    return json(submission, { status: 400 });
  }

  if (!data.features[0].properties.context) {
    submission.error["geoLocation"] = "the direction is not valid.";
    return json(submission, { status: 400 });
  }

  if (data.features[0].properties.context.region.name !== "Málaga") {
    submission.error["geoLocation"] = "the direction is not inside Málaga.";
    return json(submission, { status: 400 });
  }
  const cloudflarePostBody = new FormData();

  cloudflarePostBody.append("file", img, img.name);

  const uploadImgsRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_IMG_API_KEY}`,
      },
      body: cloudflarePostBody,
    },
  );

  const uploadImgsData = await uploadImgsRes.json();

  if (uploadImgsData.errors.length) {
    submission.error["geoLocation"] = uploadImgsData.errors[0].message;
    return json(submission, { status: 400 });
  }

  const property = await createProperty({
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
    img: {
      url: ` https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/${
        uploadImgsData.result.id as string
      }/public`,
      alt: img.name,
    },
  });

  return redirect(`/properties/${property.id}`);
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
      geoCode,
      img,
    },
  ] = useForm({
    lastSubmission,
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  const [address1Value, setAddress1Value] = useState(
    address1.defaultValue ?? "",
  );
  const [geoCodeValue, setGeoCodeValue] = useState(geoCode.defaultValue ?? "");
  const [feature, setFeature] = useState();

  const [showMinimap, setShowMiniMap] = useState(false);
  const handleRetrieve = (res: any) => {
    setFeature(res.features[0]);
    setGeoCodeValue(res.features[0].properties.mapbox_id);
    setShowMiniMap(true);
  };

  const customInputRef = useRef<HTMLInputElement>(null);

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      {...form.props}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
      className="flex justify-center items-center mb-14 "
    >
      <ClientOnly fallback={void 0}>
        {() => (
          <>
            <div className="w-[70%] ">
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
                      autoComplete="country"
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
                      autoComplete="postal-code"
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
                      autoComplete="address-level2"
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
                      autoComplete="address-level1"
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
              <div className="flex justify-between">
                <div>
                  <label className="flex w-full flex-col gap-1">
                    <span> Address Line 1 : </span>
                    {/* 
// @ts-ignore */}
                    <AddressAutofill
                      onRetrieve={handleRetrieve}
                      accessToken={data.ENV.MAPBOX_ACCES_TOKEN}
                    >
                      <input
                        autoComplete="address-line1"
                        onChange={(e) => {
                          const { value } = e.target;
                          setAddress1Value(value);
                        }}
                        className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
                      />
                    </AddressAutofill>

                    <input
                      defaultValue={address1Value}
                      {...conform.input(address1, { hidden: true })}
                      onChange={(e) => setAddress1Value(e.target.value)}
                      onFocus={() => customInputRef.current?.focus()}
                      type="hidden"
                      autoComplete="address-line1"
                      className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
                    />
                    <input
                      defaultValue={geoCodeValue}
                      {...conform.input(geoCode, { hidden: true })}
                      onChange={(e) => setGeoCodeValue(e.target.value)}
                      onFocus={() => customInputRef.current?.focus()}
                      type="hidden"
                      className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
                    />
                    <div className="  text-red-500 ">{address1.error}</div>
                    <div className="  text-red-500 ">
                      {lastSubmission?.error.geoLocation
                        ? lastSubmission?.error.geoLocation
                        : ""}
                    </div>
                  </label>
                </div>
                <div id="minimap-container" className="  h-64  w-60  mt18">
                  {/* // @ts-ignore */}
                  <AddressMinimap
                    accessToken={data.ENV.MAPBOX_ACCES_TOKEN}
                    show={showMinimap}
                    feature={feature}
                  ></AddressMinimap>
                </div>
              </div>
              <div>
                <label className="flex w-full flex-col gap-1">
                  <span> Address Line 2 : </span>
                  <input
                    autoComplete="address-line2"
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

              <div>
                <label className="flex w-full flex-col gap-1">
                  Profile
                  <input type="file" name={img.name} />
                  <div className="  text-red-500 ">{img.error}</div>
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
            </div>
          </>
        )}
      </ClientOnly>
    </Form>
  );
}
