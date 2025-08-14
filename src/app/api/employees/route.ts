
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('assetverse');
    const employees = await db.collection('employees').find({}).sort({ name: 1 }).toArray();
    return NextResponse.json(employees);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const employee = await request.json();
    const client = await clientPromise;
    const db = client.db('assetverse');
    const result = await db.collection('employees').insertOne({ ...employee, createdAt: new Date().toISOString() });
    const newEmployee = { ...employee, _id: result.insertedId };
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error creating employee' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        const employeeData = await request.json();
        const { id, ...updateData } = employeeData;
        
        if (!id) {
            return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('assetverse');
        const result = await db.collection('employees').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        return NextResponse.json({ ...updateData, _id: id });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Error updating employee' }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
         if (!id) {
            return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
        }
        const client = await clientPromise;
        const db = client.db('assetverse');
        const result = await db.collection('employees').deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch(e) {
        console.error(e);
        return NextResponse.json({ error: 'Error deleting employee' }, { status: 500 });
    }
}
