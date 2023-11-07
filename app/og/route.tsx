import fs from "fs";
import path from "path";
import satori from "satori";
import { NextResponse } from "next/server";

export async function generateSVG(name = "Nome do participante") {
  const width = 1811;
  const height = 1299;
  const image = fs.readFileSync(path.resolve("assets/template-bg.jpg"), {
    encoding: "base64",
  });

  const font = fs.readFileSync(
    path.resolve(
      "node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf"
    )
  );

  const svg = await satori(
    <div tw="flex flex-col items-center justify-center text-3xl h-full w-full bg-white font-bold">
      <img
        tw="absolute"
        src={`data:image/jpeg;base64,${image}`}
        alt="certificate background"
      />
      <div tw="flex flex-col items-center">
        <p tw="text-8xl">Certificado de Participação</p>
        <p>Concedemos esse cetificado para</p>
        <p tw="text-7xl">{name}</p>
        <p tw="max-w-7xl">
          por sua participação na VI Conferência Internacional de Melhores
          Práticas Lean & Six Sigma, realizada no dia 08 de Novembro de 2023,
          com carga horária de 09h.
        </p>
      </div>
    </div>,
    {
      width: width,
      height: height,
      fonts: [
        {
          name: "Noto",
          data: font,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
  return svg;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const hasTitle = searchParams.has("name");
    const name = hasTitle
      ? searchParams.get("name")?.slice(0, 100)
      : "Nome do participante";

    const svg = await generateSVG(name);

    const response = new NextResponse(svg, {
      headers: { "content-type": "image/svg+xml" },
    });

    return response;
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
