import { createFileRoute } from "@tanstack/react-router";
import { PicoTab } from "@/components/project/pico-tab";
import { IngestTab } from "@/components/project/ingest-tab";
import { MapTab } from "@/components/project/map-tab";
import { GapsTab } from "@/components/project/gaps-tab";
import { ReportTab } from "@/components/project/report-tab";

export const Route = createFileRoute("/projects/$projectId/$tab")({
  component: TabRouter,
});

function TabRouter() {
  const { projectId, tab } = Route.useParams();
  switch (tab) {
    case "pico":
      return <PicoTab projectId={projectId} />;
    case "ingest":
      return <IngestTab projectId={projectId} />;
    case "map":
      return <MapTab projectId={projectId} />;
    case "gaps":
      return <GapsTab projectId={projectId} />;
    case "report":
      return <ReportTab projectId={projectId} />;
    default:
      return (
        <div className="max-w-7xl mx-auto px-6 py-12 text-muted-foreground">
          Unknown section.
        </div>
      );
  }
}
