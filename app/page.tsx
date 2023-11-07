import Image from "next/image";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";
import blobStream from "blob-stream";
import { generateSVG } from "./og/route";

async function getData() {
  const svg = await generateSVG();
  const width = 1811;
  const height = 1299;

  const doc = new PDFDocument({
    compress: false,
    size: [width, height],
  });
  SVGtoPDF(doc, svg, 0, 0, {
    width,
    height,
    preserveAspectRatio: `xMidYMid meet`,
  });
  const stream = doc.pipe(blobStream());
  stream.on("finish", () => {
    const blob = stream.toBlob("application/pdf");
    return URL.createObjectURL(blob);
  });
  doc.end();

  return doc;
}

export default function Home() {
  const doc = getData();
  return (
    <iframe
      key="pdf"
      width="100%"
      height="100%"
      src={
        doc +
        "#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0"
      }
    />
  );
}
