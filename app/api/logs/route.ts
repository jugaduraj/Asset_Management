
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import type { Log } from '../../../lib/types';

async function getDb() {
    const client = await clientPromise;
    return client.db('assetzen');
}

export async function GET() {
  try {
    const db = await getDb();
    const logs = await db.collection('logs').find({}).sort({ timestamp: -1 }).toArray();
    return NextResponse.json(logs);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: `Error fetching logs: ${e.message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const logData = await request.json();
        const newLog = {
            ...logData,
            timestamp: new Date().toISOString(),
        };

        const db = await getDb();
        const result = await db.collection('logs').insertOne(newLog);
        const insertedLog = await db.collection('logs').findOne({ _id: result.insertedId });

        return NextResponse.json(insertedLog, { status: 201 });
    } catch(e: any) {
        console.error(e)
        return NextResponse.json({ error: `Error creating log: ${e.message}` }, { status: 500 });
    }
}
