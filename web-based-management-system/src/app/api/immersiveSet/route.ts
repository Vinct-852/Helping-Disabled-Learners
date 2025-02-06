// app/api/immersiveSet/route.ts

import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const immersiveID = searchParams.get("_id");
  const idsParam = searchParams.get("ids");

  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('immersiveSets');

    let immersiveSets;

    if (idsParam) {
      // Handle multiple IDs
      const ids = idsParam.split(',');
      const areValidIds = ids.every(id => ObjectId.isValid(id));
      if (!areValidIds) {
        return NextResponse.json(
          { error: 'Invalid ID(s) format' },
          { status: 400 }
        );
      }
      const objectIds = ids.map(id => new ObjectId(id));
      immersiveSets = await collection.find({ _id: { $in: objectIds } }).toArray();
    } else if (immersiveID) {
      // Handle single ID
      if (!ObjectId.isValid(immersiveID)) {
        return NextResponse.json(
          { error: 'Invalid immersive set ID format' },
          { status: 400 }
        );
      }
      immersiveSets = await collection.findOne({ _id: new ObjectId(immersiveID) });
    } else {
      // Fetch all if no parameters
      immersiveSets = await collection.find().toArray();
    }

    if (!immersiveSets || (Array.isArray(immersiveSets) && immersiveSets.length === 0)) {
      return NextResponse.json(
        { error: 'Immersive set(s) not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(immersiveSets);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch immersive sets' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('immersiveSets');

    // Parse the request body
    const body = await req.json();

    // Create a new immersive set
    const newImmersiveSet = {
      ...body,
      _id: new ObjectId(), // Generate a new ObjectId for MongoDB
      // createdAt: new Date(), // Optional: Add a timestamp
    };

    const result = await collection.insertOne(newImmersiveSet);

    // Check if the insert was successful
    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to create immersive set' },
        { status: 500 }
      );
    }

    // Return the created immersive set (excluding the _id field if necessary)
    return NextResponse.json(
      { message: 'Immersive set created successfully', id: result.insertedId },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating immersive set:', error);
    return NextResponse.json(
      { error: 'Failed to create immersive set' },
      { status: 500 }
    );
  }
}