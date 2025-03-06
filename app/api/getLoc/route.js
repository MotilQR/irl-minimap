import { NextResponse } from "next/server";

// Временное хранилище местоположений
const locations = new Map();

/**
 * GET-запрос для получения координат по коду
 * @param {Request} req
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code || !locations.has(code)) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json(locations.get(code));
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}