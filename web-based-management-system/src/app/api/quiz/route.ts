import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const quizID = searchParams.get("_id");

  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('quizs');

    let quizs;

    if (!quizID) {
        // Fetch all quizzes if no ID provided
        quizs = await collection.find().toArray();
    } else {
        // Validate if quizID is a valid 24-character ObjectId
        if (!ObjectId.isValid(quizID)) {
            return NextResponse.json(
                { error: 'Invalid quiz ID format' },
                { status: 400 }
            );
        }
        // Convert string ID to ObjectId and fetch the quiz
        quizs = await collection.findOne({ _id: new ObjectId(quizID) });
    }

    // Handle case where no quiz is found
    if (!quizs) {
        return NextResponse.json(
            { error: 'Quiz not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(quizs);

  } catch (error) {
    return NextResponse.json(
        { error: 'Failed to fetch quizzes' },
        { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    // TODO

    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('quizs');

    // Create the quiz document structure
    const quizDocument = { quiz: body };

    // Insert new quiz and get the generated ID
    const result = await collection.insertOne(quizDocument);
    
    // Return the new quiz ID with the quiz data nested under "quiz"
    return NextResponse.json(
      { _id: result.insertedId, ...quizDocument },
      { status: 201 }
    );

  } catch (error) {
    console.error('Failed to create quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}