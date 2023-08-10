import { useForm } from "@conform-to/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import validator from "validator";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { createProperty } from "~/models/properties.server";
import { requireUserId } from "~/session.server";

const schema = z.object({
  phone: z.string().max(40).min(1).refine(validator.isMobilePhone),
  country: z.string().max(40).min(1).refine(validator.isAlphanumeric),
  address1: z.string().max(40).min(1),
  address2: z.string().max(40).min(1),
  cp: z
    .string()
    .max(40)
    .min(1)
    .refine((cp) => validator.isPostalCode(cp, "ES")),
  city: z.string().max(40).min(1),
  state: z.string().max(40).min(1),
  bedrooms: z.coerce.number().min(1),
  garage: z.coerce.boolean(),
  ownerPrice: z.coerce.number().min(1),
  title: z.string().max(40).min(1),
  size: z.coerce.number().min(1),
  description: z.string().max(40).min(1),
  bathroom: z.string().refine(validator.isNumeric).transform(Number),
});

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  if (!userId) {
    return redirect("/login");
  }
  return json("ok", { status: 200 });
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  if (!userId) {
    return redirect("/login");
  }

  const formData = await request.formData();
  console.log(formData.get("Garage"));
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
  });

  return redirect(`/properties/${note.id}`);
};

export default function NewPropertyPage() {
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
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

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
    >
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
          <span>Phone: </span>
          <input
            name={phone.name}
            className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
          />
          <div className="  text-red-500 ">{phone.error}</div>
        </label>
      </div>
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
          <span> Address Line 1 : </span>
          <input
            name={address1.name}
            className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
          />
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
      <div>
        <label className="flex w-full flex-col gap-1">
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
          <span>OwnerPrice : </span>
          <input
            name={ownerPrice.name}
            type="number"
            className="flex-1 rounded-md border-2 focus:border-blue-500  border-gray-600 px-3 text-lg leading-loose outline-none overflow-hidden"
          />
          <div className="  text-red-500 ">{ownerPrice.error}</div>
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
