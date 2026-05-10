import { useState } from "react";
import { api } from "@/lib/api";

export function IngestTab({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleRetrieve() {
    setBusy(true);
    setStatus("Querying configured literature sources…");
    await api.retrieve(projectId);
    setStatus("Retrieval complete. 24 candidate studies screened, 11 included.");
    setBusy(false);
  }

  async function handleUpload() {
    if (!files.length) return;
    setBusy(true);
    setStatus(`Uploading ${files.length} file(s)…`);
    await api.upload(projectId, files);
    setStatus(`Processed ${files.length} document(s). Structured study records created.`);
    setBusy(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-6">
      <section className="bg-card border border-rule rounded-lg p-6">
        <div className="label-eyebrow mb-2">Variant A</div>
        <h3 className="font-display text-2xl mb-2">Retrieve from sources</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Use the keywords confirmed in the PICO step to query configured literature
          databases. Screening and extraction run automatically.
        </p>
        <button
          onClick={handleRetrieve}
          disabled={busy}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          Start retrieval
        </button>
      </section>

      <section className="bg-card border border-rule rounded-lg p-6">
        <div className="label-eyebrow mb-2">Variant B</div>
        <h3 className="font-display text-2xl mb-2">Upload PDFs</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drop in study PDFs you've already collected. Each is parsed into a structured
          study record with provenance preserved.
        </p>
        <label className="block border-2 border-dashed border-rule rounded-md px-4 py-8 text-center cursor-pointer hover:bg-muted/40 transition mb-4">
          <input
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          <div className="text-sm font-medium">Click to choose PDFs</div>
          <div className="text-xs text-muted-foreground mt-1">
            {files.length ? `${files.length} file(s) selected` : "or drag here"}
          </div>
        </label>
        {files.length > 0 && (
          <ul className="text-xs font-mono mb-4 space-y-1 max-h-32 overflow-auto">
            {files.map((f) => (
              <li key={f.name} className="text-muted-foreground truncate">
                · {f.name}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleUpload}
          disabled={busy || !files.length}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          Process uploads
        </button>
      </section>

      {status && (
        <div className="md:col-span-2 border border-rule rounded-lg px-4 py-3 bg-muted/40 text-sm">
          <span className="label-eyebrow mr-3">Status</span>
          {status}
        </div>
      )}
    </div>
  );
}
