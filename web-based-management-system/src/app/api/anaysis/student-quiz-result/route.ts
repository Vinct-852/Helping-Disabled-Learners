import connect from '@/app/utils/startMongo';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const studentID = searchParams.get("id");

  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('quizzes-results');

    if (!studentID) {
      return NextResponse.json(
        { error: 'No student ID' },
        { status: 500 }
      );
    }

    const result = await collection.find({ studentId: studentID }).toArray();
    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'No student quiz results found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch student quiz results' },
      { status: 500 }
    );
  }
}
