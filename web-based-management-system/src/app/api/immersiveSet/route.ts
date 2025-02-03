import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const immersiveID = searchParams.get("_id");

  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('immersiveSets');

    let immersiveSets;

    if (!immersiveID) {
        // Fetch all immersive sets if no ID provided
        immersiveSets = await collection.find().toArray();
    } else {
        // Validate if immersiveID is a valid 24-character ObjectId
        if (!ObjectId.isValid(immersiveID)) {
            return NextResponse.json(
                { error: 'Invalid immersive set ID format' },
                { status: 400 }
            );
        }
        // Convert string ID to ObjectId and fetch the set
        immersiveSets = await collection.findOne({ _id: new ObjectId(immersiveID) });
    }

    // Handle case where no set is found
    if (!immersiveSets) {
        return NextResponse.json(
            { error: 'Immersive set not found' },
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