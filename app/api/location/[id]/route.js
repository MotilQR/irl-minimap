import { NextResponse } from "next/server";

const locations = new Map()

export async function POST(request, context) {
    const { lat, lng } = await request.json();
    const params = await context.params;
    const id = params.id;


    if (!lat || !lng || !id) 
        return NextResponse.json({ error: "Invalid coordinates" }, { status: 404 });

    if (locations.has(id))
        return NextResponse.json({ error: "Invalid ID" }, { status: 404 });
    else 
        locations.set(id, { lat, lng });
    
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
        return NextResponse.json({ error: "Invalid ID" }, { status: 404 });
    }
    console.log("Heyyy");

    return NextResponse.json({ location: locations.get(id) });
}