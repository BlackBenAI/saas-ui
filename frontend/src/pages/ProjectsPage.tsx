import { ArrowLeft, Copy, FolderOpen, Loader2, Plus, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { EditorSidebar } from "@/components/layouts/EditorSidebar";
import { Button } from "@/components/ui/button";
import type { ProjectRecord } from "@/lib/db";
import {
  createLocalProject,
  deleteLocalProject,
  duplicateLocalProject,
  ensureLocalProject,
  getActiveLocalProjectId,
  listLocalProjects,
  openLocalProject,
} from "@/lib/local-projects";
import { formatRelativeTime } from "@/lib/utils";

export function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await ensureLocalProject();
      setProjects(await listLocalProjects());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function open(record: ProjectRecord) {
    openLocalProject(record);
    navigate("/dashboard");
  }

  async function create() {
    setBusy("create");
    try {
      const record = await createLocalProject();
      openLocalProject(record);
      navigate("/dashboard");
    } finally {
      setBusy(null);
    }
  }

  async function duplicate(record: ProjectRecord) {
    setBusy(record.id);
    try {
      await duplicateLocalProject(record);
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function remove(record: ProjectRecord) {
    if (!window.confirm(`Delete “${record.name}”? This cannot be undone.`)) return;
    setBusy(record.id);
    try {
      const wasActive = getActiveLocalProjectId() === record.id;
      await deleteLocalProject(record.id);
      const next = await ensureLocalProject();
      if (wasActive) openLocalProject(next);
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <Helmet>
        <title>Projects · SaaS-UI</title>
        <meta name="description" content="Create, open, duplicate, and delete your local design-system projects." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="hidden lg:flex">
        <EditorSidebar />
      </div>
      <div className="min-w-0 flex-1 overflow-y-auto">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Dashboard
          </Link>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-[-0.01em]">Projects</h1>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Every design system is a project stored locally. Create a new one, open an existing
                direction, or duplicate a project to explore a variant.
              </p>
            </div>
            <Button size="sm" onClick={() => void create()} disabled={busy !== null}>
              {busy === "create" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              New project
            </Button>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((record) => {
                const active = getActiveLocalProjectId() === record.id;
                return (
                  <article key={record.id} className="flex flex-col rounded-xl border bg-surface p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold">{record.name}</h2>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Updated {formatRelativeTime(record.updatedAt)}
                        </p>
                      </div>
                      <span className={`rounded-sm border px-2 py-0.5 text-[10px] ${active ? "border-success/30 bg-success/5 text-success" : "text-muted-foreground"}`}>
                        {active ? "Active" : "Local"}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-1" aria-hidden="true">
                      {Object.values(record.designSystem.colors).slice(0, 7).map((color, index) => (
                        <span key={`${color}-${index}`} className="h-6 flex-1 rounded-sm border" style={{ background: color }} />
                      ))}
                    </div>
                    <p className="mt-3 line-clamp-2 flex-1 text-[11px] leading-relaxed text-muted-foreground">
                      {record.designSystem.description || "A local-first design direction."}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button size="sm" onClick={() => open(record)}>
                        <FolderOpen className="h-3.5 w-3.5" /> Open
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => void duplicate(record)} disabled={busy !== null}>
                        <Copy className="h-3.5 w-3.5" /> Duplicate
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" className="mt-2 text-destructive" onClick={() => void remove(record)} disabled={busy !== null}>
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
