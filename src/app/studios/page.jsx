import StudiosBrowser from "@/components/studios-browser";
import { STUDIO_CATEGORIES } from "@/lib/studios";

const CATEGORY_VALUES = new Set(
  STUDIO_CATEGORIES.map(({ value }) => value)
);

export default async function StudiosPage({ searchParams }) {
  const params = await searchParams;
  const category =
    typeof params.category === "string" && CATEGORY_VALUES.has(params.category)
      ? params.category
      : "all";
  const query = typeof params.q === "string" ? params.q : "";

  return <StudiosBrowser initialCategory={category} initialQuery={query} />;
}
