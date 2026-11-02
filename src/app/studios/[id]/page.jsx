import { notFound } from "next/navigation";
import StudioDetail from "@/components/studio-detail";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const { studio } = await apiFetch(`/api/studios/${encodeURIComponent(id)}`);
    return { title: `${studio.name} — StudioSpace` };
  } catch {
    return { title: "Studio not found — StudioSpace" };
  }
}

export default async function StudioPage({ params }) {
  const { id } = await params;

  let data;

  try {
    data = await apiFetch(`/api/studios/${encodeURIComponent(id)}`);
  } catch (error) {
    if (error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <StudioDetail
      studio={data.studio}
      initialReviews={data.reviews ?? []}
      initialSummary={data.reviewsSummary ?? null}
    />
  );
}
