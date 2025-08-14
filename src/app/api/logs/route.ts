
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('assetverse');
    const logs = await db.collection('logs').find({}).sort({ timestamp: -1 }).toArray();
    return NextResponse.json(logs);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const log = await request.json();
        const client = await clientPromise;
        const db = client.db('assetverse');
        await db.collection('logs').insertOne({ ...log, timestamp: new Date().toISOString() });
        return NextResponse.json(log, { status: 201 });
    } catch(e) {
        console.error(e)
        return NextResponse.json({ error: 'Error creating log' }, { status: 500 });
    }
}
