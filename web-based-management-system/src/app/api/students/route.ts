import connect from '@/app/utils/startMongo';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const studentID = searchParams.get("id");
  const courseID = searchParams.get("courseID");

  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('student');

    let result;

    if (studentID) {
      // If studentID is provided, fetch the specific student
      result = await collection.findOne({ id: studentID });
      if (!result) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        );
      }
    } else if (courseID) {
      // If courseID is provided, fetch students by courseID
      result = await collection.find({ courses: new ObjectId(courseID) }).toArray();
      if (result.length === 0) {
        return NextResponse.json(
          { error: 'No students found for the given courseID' },
          { status: 404 }
        );
      }
    } else {
      // If no studentID or courseID, fetch all students
      result = await collection.find().toArray();
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}
