import { createFileRoute, useNavigate } from "@tanstack/react-router";
import QuickSession from "@/components/QuickSession";
import type { ClassId } from "@/lib/turn-store";

export const Route = createFileRoute("/klasse/$classId/quick")({
  component: QuickEntry,
  head: () => ({
    meta: [{ title: "Stunde — Turnnoten" }],
  }),
});

function QuickEntry() {
  const { classId } = Route.useParams() as { classId: ClassId };
  const navigate = useNavigate();
  return (
    <QuickSession
      classId={classId}
      onClose={() => navigate({ to: "/klasse/$classId", params: { classId } })}
    />
  );
}
