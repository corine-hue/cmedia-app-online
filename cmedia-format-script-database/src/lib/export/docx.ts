import { Document, HeadingLevel, ImageRun, Packer, Paragraph, TextRun } from "docx";
import { formatFields, pitchdeckFields } from "@/lib/constants";
import type { ProjectBundle } from "@/lib/types";

function section(title: string, value?: string | number | null) {
  return [
    new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ children: [new TextRun(String(value ?? ""))] })
  ];
}

export async function renderProjectDocx(bundle: ProjectBundle) {
  const children = [
    new Paragraph({
      text: bundle.project.title,
      heading: HeadingLevel.TITLE
    }),
    new Paragraph({ text: `CMedia Productions | ${bundle.project.document_type} | ${bundle.project.status}` }),
    ...section("Synopsis", bundle.project.synopsis)
  ];

  if (bundle.project.document_type === "tv_format" && bundle.format) {
    formatFields.forEach(([key, label]) => children.push(...section(label, bundle.format?.[key])));
  }

  if (bundle.project.document_type === "pitchdeck" && bundle.pitchdeck) {
    pitchdeckFields.forEach(([key, label]) => children.push(...section(label, bundle.pitchdeck?.[key])));
  }

  if (bundle.project.document_type === "script") {
    bundle.scenes?.forEach((scene) => {
      children.push(new Paragraph({ text: `Scene ${scene.scene_number}: ${scene.title ?? ""}`, heading: HeadingLevel.HEADING_1 }));
      children.push(...section("Locatie", scene.location));
      children.push(...section("Dag/Nacht", scene.day_night));
      children.push(...section("Binnen/Buiten", scene.interior_exterior));
      children.push(...section("Cast", scene.cast));
      children.push(...section("Voice-over", scene.voice_over));
      children.push(...section("Interviewvragen", scene.interview_questions));
      children.push(...section("Regie aanwijzingen", scene.direction_notes));
      children.push(...section("Camerastandpunten", scene.camera_angles));
      children.push(...section("Audio", scene.audio));
      children.push(...section("Muziek", scene.music));
      children.push(...section("Notities", scene.notes));
    });
  }

  if (bundle.project.document_type === "draaiboek") {
    (bundle.draaiboek?.rows ?? []).forEach((row, index) => {
      children.push(new Paragraph({ text: `${index + 1}. ${row.Tijd} - ${row.Onderdeel}`, heading: HeadingLevel.HEADING_2 }));
      children.push(new Paragraph(`${row.Locatie} | ${row.Verantwoordelijke} | ${row.Techniek} | ${row.Opmerkingen}`));
    });
  }

  if (bundle.images.length) {
    children.push(new Paragraph({ text: "Beeldmateriaal", heading: HeadingLevel.HEADING_1 }));
    for (const image of bundle.images) {
      children.push(new Paragraph({ text: image.alt_text ?? "Projectbeeld", heading: HeadingLevel.HEADING_2 }));
      if (image.public_url) {
        try {
          const response = await fetch(image.public_url);
          const bytes = new Uint8Array(await response.arrayBuffer());
          const imageType = (response.headers.get("content-type") ?? "").includes("png") ? "png" : "jpg";
          children.push(new Paragraph({
            children: [
              new ImageRun({
                data: bytes,
                type: imageType,
                transformation: {
                  width: 520,
                  height: 292
                }
              })
            ]
          }));
        } catch {
          children.push(new Paragraph(image.public_url));
        }
      }
    }
  }

  const document = new Document({
    creator: "CMedia Productions",
    title: bundle.project.title,
    sections: [{ children }]
  });

  return Packer.toBuffer(document);
}
