
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('assetverse');
    const assets = await db.collection('assets').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(assets);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching assets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const asset = await request.json();
    const client = await clientPromise;
    const db = client.db('assetverse');
    const result = await db.collection('assets').insertOne({ ...asset, createdAt: new Date().toISOString() });
    const newAsset = { ...asset, _id: result.insertedId };
    return NextResponse.json(newAsset, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error creating asset' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        const assetData = await request.json();
        const { id, ...updateData } = assetData;
        
        if (!id) {
            return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
        }

        // Ensure _id is not part of the update operation
        delete updateData._id;

        const client = await clientPromise;
        const db = client.db('assetverse');
        const result = await db.collection('assets').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        return NextResponse.json({ ...updateData, _id: id });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Error updating asset' }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
         if (!id) {
            return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
        }
        const client = await clientPromise;
        const db = client.db('assetverse');
        const result = await db.collection('assets').deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Asset deleted successfully' });
    } catch(e) {
        console.error(e);
        return NextResponse.json({ error: 'Error deleting asset' }, { status: 500 });
    }
}
