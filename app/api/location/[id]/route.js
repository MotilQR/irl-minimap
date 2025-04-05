import { NextResponse } from "next/server";

const locations = new Map()

export async function POST(request, context) {
    const { cords } = await request.json();
    const params = await context.params;
    const id = params.id;

    if (!cords || !id) 
        return NextResponse.json({ error: "Invalid coordinates" }, { status: 404 });

    locations.set(id, { cords });

    console.log(`${id} pushed correctly!`);
    return NextResponse.json({ message: "Ok" });
}

export async function GET(request, { params }) {
    const paramss = await params;
    const id = paramss.id;

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    console.log("Requested ID:", id);
    if (!locations.has(id)) {
        console.log("Invalid ID");
        return NextResponse.json({ error: "Invalid ID" }, { status: 404 });
    }
    console.log("Location fetched successfully");

    return NextResponse.json({ cords: locations.get(id) });
}