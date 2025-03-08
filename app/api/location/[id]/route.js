import { NextResponse } from "next/server";

const locations = new Map()

export async function POST(request, context) {
    const { lat, lng, rot } = await request.json();
    const params = await context.params;
    const id = params.id;

    if (!lat || !lng || !id) 
        return NextResponse.json({ error: "Invalid coordinates" }, { status: 404 });

    locations.set(id, { lat, lng, rot});

    console.log("Location pushed correctly!");
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
        console.log("Ivalid ID");
        return NextResponse.json({ error: "Invalid ID" }, { status: 404 });
    }
    console.log("Heyyy");

    return NextResponse.json({ location: locations.get(id) });
}