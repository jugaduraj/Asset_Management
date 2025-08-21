
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Employee } from '../../../lib/types';

async function getDb() {
    const client = await clientPromise;
    return client.db('assetzen');
}

export async function GET() {
  try {
    const db = await getDb();
    const employees = await db.collection('employees').find({}).sort({ name: 1 }).toArray();
    return NextResponse.json(employees);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: `Error fetching employees: ${e.message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const employeeData = await request.json();
    const newEmployee = {
      ...employeeData,
      createdAt: new Date().toISOString(),
    };
    
    const db = await getDb();
    const result = await db.collection('employees').insertOne(newEmployee);
    const insertedEmployee = await db.collection('employees').findOne({ _id: result.insertedId });
    
    return NextResponse.json(insertedEmployee, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: `Error creating employee: ${e.message}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        const employeeData = await request.json();
        const { _id, ...updateData } = employeeData;
        
        if (!_id) {
            return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
        }

        const db = await getDb();
        const result = await db.collection('employees').updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }
        
        const updatedEmployee = await db.collection('employees').findOne({ _id: new ObjectId(_id) });
        return NextResponse.json(updatedEmployee);

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: `Error updating employee: ${e.message}` }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
         if (!id) {
            return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
        }
        
        const db = await getDb();
        const result = await db.collection('employees').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch(e: any) {
        console.error(e);
        return NextResponse.json({ error: `Error deleting employee: ${e.message}` }, { status: 500 });
    }
}
