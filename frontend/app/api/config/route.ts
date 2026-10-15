export const dynamic = "force-dynamic";

export function GET() {
  const cartoApiKey =
    process.env.CARTO_API_KEY ??
    process.env.NEXT_PUBLIC_CARTO_API_KEY ??
    "";

  return Response.json({ cartoApiKey });
}
