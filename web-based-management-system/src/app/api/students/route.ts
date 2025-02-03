import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const studentID = searchParams.get("id");

  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('student');

    let student;
    // Check if studentID is provided
    if (!studentID) {
        // If no studentID, fetch all students
        student = await collection.find().toArray();
    } else {
        // If studentID is provided, fetch the specific student
        student = await collection.findOne({ id: studentID });
    }

    if (!student) {
        return NextResponse.json(
            { error: 'Student not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(student);

  } catch (error) {
    return NextResponse.json(
        { error: 'Failed to fetch student' },
        { status: 500 }
    );
  }
}