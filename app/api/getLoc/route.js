import { NextResponse } from "next/server";

// Временное хранилище местоположений
const locations = new Map();

/**
 * POST-запрос для получения координат по коду (из body)
 */
export async function POST(req) {
  try {
    const { code } = await req.json();

    if (!code || !locations.has(code)) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }
    return NextResponse.json(locations.get(code)); // Возвращаем координаты
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
