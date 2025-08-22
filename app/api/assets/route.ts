
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Asset } from '../../../lib/types';

async function getDb() {
    const client = await clientPromise;
    return client.db('assetzen');
}

export async function GET() {
  try {
    const db = await getDb();
    const assets = await db.collection('assets').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(assets);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: `Error fetching assets: ${e.message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const assetData = await request.json();
    const newAsset = {
      ...assetData,
      createdAt: new Date().toISOString(),
    };
    const db = await getDb();
    const result = await db.collection('assets').insertOne(newAsset);
    
    // Fetch the inserted document to return it in the response
    const insertedAsset = await db.collection('assets').findOne({ _id: result.insertedId });

    return NextResponse.json(insertedAsset, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: `Error creating asset: ${e.message}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        const assetData = await request.json();
        const { _id, ...updateData } = assetData;
        
        if (!_id) {
            return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
        }

        if (Array.isArray(_id)) {
            // Handle bulk updates
            const db = await getDb();
            const result = await db.collection('assets').updateMany(
                { _id: { $in: _id.map(id => new ObjectId(id)) } },
                { $set: updateData }
            );
            return NextResponse.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
        } else {
            // Handle single update
            const db = await getDb();
            const result = await db.collection('assets').updateOne(
                { _id: new ObjectId(_id) },
                { $set: updateData }
            );

            if (result.matchedCount === 0) {
                return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
            }

            const updatedAsset = await db.collection('assets').findOne({ _id: new ObjectId(_id) });
            return NextResponse.json(updatedAsset);
        }

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: `Error updating asset: ${e.message}` }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
         if (!id) {
            return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
        }
        
        const db = await getDb();
        const result = await db.collection('assets').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Asset deleted successfully' });
    } catch(e: any) {
        console.error(e);
        return NextResponse.json({ error: `Error deleting asset: ${e.message}` }, { status: 500 });
    }
}
