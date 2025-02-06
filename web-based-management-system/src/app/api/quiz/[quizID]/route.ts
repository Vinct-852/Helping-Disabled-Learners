import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the structure of the incoming data
    // if (!body || !body._id || !body.studentId || !body.quizId || !body.date || !body.answers) {
    //   return NextResponse.json(
    //     { error: 'Missing required fields in the request body' },
    //     { status: 400 }
    //   );
    // }

    // Validate if quizId is a valid 24-character ObjectId
    // if (!body.quizId || !body.quizId.$oid || !ObjectId.isValid(body.quizId.$oid)) {
    //   return NextResponse.json(
    //     { error: 'Invalid quiz ID format' },
    //     { status: 400 }
    //   );
    // }

    // TODO: Add more comprehensive validation for 'answers' array and its contents
    // if (!Array.isArray(body.answers)) {
    //     return NextResponse.json({error: 'Answers must be an array'}, {status: 400});
    // }

    const client = await connect;
    const db = client.db('Teacher-Management-System'); // Replace with your actual DB name if different
    const collection = db.collection('quizzes-results'); // Ensure the collection name matches

    // Modify the _id in the body to be an actual ObjectId
    body.quizId = new ObjectId(body.quizId.$oid);

    const result = await collection.insertOne(body);

    return NextResponse.json(
      { _id: result.insertedId, ...body },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Failed to save quiz result:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz result: ' + error.message },
      { status: 500 }
    );
  }
}
