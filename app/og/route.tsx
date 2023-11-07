import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const image = await fetch(
      new URL("../../assets/template-bg.jpg", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has("name");
    const name = hasTitle
      ? searchParams.get("name")?.slice(0, 100)
      : "Nome do participante";

    return new ImageResponse(
      (
        <div tw="flex flex-col items-center justify-center text-3xl h-full w-full bg-white font-bold">
          <img tw="absolute" src={image} />
          <div tw="flex flex-col items-center">
            <p tw="text-8xl">Certificado de Participação</p>
            <p>O Gemba Group certifica que</p>
            <p tw="text-7xl">{name}</p>
            <p>
              participou da VI Conferência Internacional de Melhores Práticas
              Lean & Six Sigma
            </p>
            <p tw="text-4xl">Curitiba, 08 de Novembro de 2023</p>
          </div>
        </div>
      ),
      {
        width: 1811,
        height: 1299,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
