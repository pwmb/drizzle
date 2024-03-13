import { API_KEY } from "@/utils/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=10&appid=${API_KEY}`;
  const res = await fetch(url, {
    next: {
      revalidate: 3,
    },
  });

  const data = await res.json();

  return Response.json({ data });
}
