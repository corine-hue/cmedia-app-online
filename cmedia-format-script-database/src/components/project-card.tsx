import Link from "next/link";
import { Copy, Download, FilePenLine, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { projectStatuses, projectTypes } from "@/lib/constants";
import { humanDate } from "@/lib/utils";
import type { Project } from "@/lib/types";

type Props = {
  project: Project;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ProjectCard({ project, onDuplicate, onDelete }: Props) {
  const type = projectTypes.find((item) => item.value === project.document_type)?.label;
  const status = projectStatuses.find((item) => item.value === project.status)?.label;

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge>{type}</Badge>
            <h2 className="mt-4 text-2xl font-bold text-broadcast-white">{project.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{project.synopsis || "Nog geen synopsis toegevoegd."}</p>
          </div>
          <Badge className="border-white/15 text-white">{status}</Badge>
        </div>
        <div className="flex items-center justify-between border-t border-broadcast-line pt-4 text-xs text-slate-500">
          <span>Laatst aangepast {humanDate(project.updated_at)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/projects/${project.id}`}>
            <Button variant="secondary">
              <FilePenLine size={16} />
              Bewerken
            </Button>
          </Link>
          <Button variant="secondary" onClick={() => onDuplicate(project.id)}>
            <Copy size={16} />
            Dupliceren
          </Button>
          <a href={`/api/projects/${project.id}/export?type=pdf`}>
            <Button variant="secondary">
              <Download size={16} />
              PDF
            </Button>
          </a>
          <a href={`/api/projects/${project.id}/export?type=docx`}>
            <Button variant="secondary">Word</Button>
          </a>
          <Button variant="danger" onClick={() => onDelete(project.id)}>
            <Trash2 size={16} />
            Verwijderen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
