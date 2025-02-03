import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch a student by studentId
export async function GET(
    request: NextRequest,
    { params }: { params: { studentID: string } }
) {
    try {
      const client = await connect;
      const db = client.db('Teacher-Management-System');
      const collection = db.collection('student');
  
      const { studentID } = params;
  
      // Find the student by studentId using findOne
      const student = await collection.findOne({ "id": studentID });
  
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