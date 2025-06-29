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
    
    // Extract the quiz object from the nested structure if it exists
    const quizDocument = body;
    
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('quizs');

    // Insert new quiz and get the generated ID
    const result = await collection.insertOne(quizDocument);
    
    // Return the new quiz ID with the quiz data
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

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const quizID = searchParams.get("_id");

  if (!quizID) {
      return NextResponse.json(
          { error: 'Quiz ID is required' },
          { status: 400 }
      );
  }

  // Validate if quizID is a valid 24-character ObjectId
  if (!ObjectId.isValid(quizID)) {
      return NextResponse.json(
          { error: 'Invalid quiz ID format' },
          { status: 400 }
      );
  }

  try {
      const client = await connect;
      const db = client.db('Teacher-Management-System');
      const collection = db.collection('quizs');

      const result = await collection.deleteOne({ _id: new ObjectId(quizID) });

      if (result.deletedCount === 0) {
          return NextResponse.json(
              { error: 'Quiz not found' },
              { status: 404 }
          );
      }

      return NextResponse.json({ message: 'Quiz deleted successfully' }, { status: 200 });

  } catch (error) {
      console.error('Failed to delete quiz:', error);
      return NextResponse.json(
          { error: 'Failed to delete quiz' },
          { status: 500 }
      );
  }
}