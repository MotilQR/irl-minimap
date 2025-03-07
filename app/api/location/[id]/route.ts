import { NextResponse } from "next/server";

const locations = new Map()

export async function POST(request: Request, context: { params: { id: string } }) {
    const { latitude, longtitude } = await request.json();
    const params = await context.params;
    const id = params.id;

    if (!latitude || !longtitude || !id) 
        return NextResponse.json({ error: "Invalid coordinates" }, { status: 404 });

    if (locations.has(id))
        return NextResponse.json({ error: "Invalid ID" }, { status: 404 });
    else 
        locations.set(id, { latitude, longtitude });
    
    return NextResponse.json({ message: "Ok" });
}

export async function GET(context: { params: { id: string } }) {
    const params = await context.params;
    const id = params.id;
    
    if (!locations.has(id))
        return NextResponse.json({ error: "Invalid ID" }, { status: 404 })

    return NextResponse.json({ message: "Ok" }, locations.get(id));
}