import { notFound } from "next/navigation";
import { STUDIOS, getStudioBySlug } from "@/lib/studios";
import StudioDetail from "@/components/studio-detail";

export function generateStaticParams() {
  return STUDIOS.map(({ slug }) => ({ id: slug }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const studio = getStudioBySlug(id);

  return {
    title: studio
      ? `${studio.name} — StudioSpace`
      : "Studio not found — StudioSpace",
  };
}

export default async function StudioPage({ params }) {
  const { id } = await params;
  const studio = getStudioBySlug(id);

  if (!studio) {
    notFound();
  }

  return <StudioDetail studio={studio} />;
}
