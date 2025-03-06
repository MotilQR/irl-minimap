import { NextResponse } from "next/server";

// Временное хранилище местоположений
const locations = new Map();

/**
 * POST-запрос для загрузки координат
 * @param {Request} req
 */
export async function POST(req) {
  try {
    const { latitude, longitude, code } = await req.json();

    if (!latitude || !longitude || !code) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    locations.set(code, { latitude, longitude, timestamp: Date.now() });

    return NextResponse.json({ message: "Location updated" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}