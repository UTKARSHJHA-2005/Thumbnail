import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { imageBase64 } = await req.json();

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "db21e45f8c1f4cf0af9df9f5e4f48b36c23ebfe6d1c26827fc8f08e8a20f9e76", // Real-ESRGAN
      input: {
        image: imageBase64,
      },
    }),
  });

  const prediction = await response.json();
  return NextResponse.json(prediction);
}