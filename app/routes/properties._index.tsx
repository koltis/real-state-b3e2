import { Link } from "@remix-run/react";

export default function PropertyIndexPage() {
  return (
    <p>
      No Property selected. Select a property on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new property.
      </Link>
    </p>
  );
}
