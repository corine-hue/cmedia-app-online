import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatFields, pitchdeckFields } from "@/lib/constants";
import type { ProjectBundle } from "@/lib/types";

const navy = rgb(0.03, 0.07, 0.14);
const gold = rgb(0.85, 0.7, 0.42);
const white = rgb(0.96, 0.96, 0.93);
const muted = rgb(0.74, 0.78, 0.84);

function textLines(text: string, max = 86) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

export async function renderProjectPdf(bundle: ProjectBundle) {
  const pdf = await PDFDocument.create();
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  let logo;

  try {
    const logoResponse = await fetch(new URL("/brand/cmedia-logo-white.png", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
    logo = await pdf.embedPng(await logoResponse.arrayBuffer());
  } catch {
    logo = null;
  }

  const addPage = (title: string, body: Array<[string, string]>) => {
    const page = pdf.addPage([1280, 720]);
    page.drawRectangle({ x: 0, y: 0, width: 1280, height: 720, color: navy });
    if (logo) {
      page.drawImage(logo, { x: 64, y: 626, width: 193, height: 60 });
    } else {
      page.drawText("CMEDIA PRODUCTIONS", { x: 64, y: 650, size: 20, font: bold, color: gold });
    }
    page.drawText(title, { x: 64, y: 570, size: 48, font: bold, color: white });
    page.drawLine({ start: { x: 64, y: 540 }, end: { x: 1216, y: 540 }, thickness: 2, color: gold });
    let y = 495;
    body.forEach(([label, value]) => {
      if (y < 92) return;
      page.drawText(label.toUpperCase(), { x: 64, y, size: 13, font: bold, color: gold });
      y -= 24;
      textLines(value || "-", 118).slice(0, 5).forEach((line) => {
        page.drawText(line, { x: 64, y, size: 20, font: regular, color: muted });
        y -= 28;
      });
      y -= 14;
    });
  };

  addPage(bundle.project.title, [
    ["Type", bundle.project.document_type.replace("_", " ")],
    ["Status", bundle.project.status.replace("_", " ")],
    ["Synopsis", bundle.project.synopsis ?? ""]
  ]);

  if (bundle.project.document_type === "tv_format" && bundle.format) {
    formatFields.forEach(([key, label]) => addPage(label, [[label, String(bundle.format?.[key] ?? "")]]));
  }

  if (bundle.project.document_type === "pitchdeck" && bundle.pitchdeck) {
    pitchdeckFields.forEach(([key, label]) => addPage(label, [[label, String(bundle.pitchdeck?.[key] ?? "")]]));
  }

  if (bundle.project.document_type === "script") {
    bundle.scenes?.forEach((scene) => {
      addPage(`Scene ${scene.scene_number}: ${scene.title ?? "Untitled"}`, [
        ["Locatie", scene.location ?? ""],
        ["Dag/Nacht", scene.day_night ?? ""],
        ["Cast", scene.cast ?? ""],
        ["Voice-over", scene.voice_over ?? ""],
        ["Regie", scene.direction_notes ?? ""]
      ]);
    });
  }

  if (bundle.project.document_type === "draaiboek") {
    addPage("Draaiboek", (bundle.draaiboek?.rows ?? []).map((row) => [row.Tijd, `${row.Onderdeel} | ${row.Locatie} | ${row.Verantwoordelijke} | ${row.Techniek} | ${row.Opmerkingen}`]));
  }

  for (let index = 0; index < bundle.images.length; index += 1) {
    const image = bundle.images[index];
    const page = pdf.addPage([1280, 720]);
    page.drawRectangle({ x: 0, y: 0, width: 1280, height: 720, color: navy });
    page.drawText(`BEELD ${index + 1}`, { x: 64, y: 650, size: 20, font: bold, color: gold });
    page.drawText(image.alt_text ?? "Projectbeeld", { x: 64, y: 600, size: 36, font: bold, color: white });

    if (image.public_url) {
      try {
        const response = await fetch(image.public_url);
        const bytes = await response.arrayBuffer();
        const contentType = response.headers.get("content-type") ?? "";
        const embedded = contentType.includes("png")
          ? await pdf.embedPng(bytes)
          : await pdf.embedJpg(bytes);
        const maxWidth = 1050;
        const maxHeight = 430;
        const scale = Math.min(maxWidth / embedded.width, maxHeight / embedded.height);
        const width = embedded.width * scale;
        const height = embedded.height * scale;
        page.drawImage(embedded, {
          x: 64,
          y: 100,
          width,
          height
        });
      } catch {
        page.drawText(image.public_url, { x: 64, y: 450, size: 18, font: regular, color: muted });
      }
    }
  }

  return Buffer.from(await pdf.save());
}
