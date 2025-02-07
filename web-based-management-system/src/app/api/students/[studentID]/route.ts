import connect from '@/app/utils/startMongo';
import { ObjectId } from 'mongodb';
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

// POST: Add a new course ID to the student's courses array
export async function POST(
  request: NextRequest,
  { params }: { params: { studentID: string } }
) {
  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('student');

    const { studentID } = params;
    const { courseID } = await request.json();

    if (!ObjectId.isValid(studentID) || !ObjectId.isValid(courseID)) {
      return NextResponse.json(
        { error: 'Invalid student ID or course ID format' },
        { status: 400 }
      );
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(studentID) },
      { $addToSet: { courses: new ObjectId(courseID) } }
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Student not found or course already added' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Course added to student successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add course to student' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a course ID from the student's courses array
export async function DELETE(
  request: NextRequest,
  { params }: { params: { studentID: string } }
) {
  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('student');
    const { studentID } = params;
    const { courseID } = await request.json();

    if (!ObjectId.isValid(studentID) || !ObjectId.isValid(courseID)) {
      return NextResponse.json(
        { error: 'Invalid student ID or course ID format' },
        { status: 400 }
      );
    }

    // Find the student by studentId
    const student = await collection.findOne({ _id: new ObjectId(studentID) });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Remove the courseID from the courses array
    const updatedCourses = student.courses.filter((id: ObjectId) => !id.equals(new ObjectId(courseID)));

    // Update the student's courses array
    const result = await collection.updateOne(
      { _id: new ObjectId(studentID) },
      { $set: { courses: updatedCourses } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update student\'s courses' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Course removed from student successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove course from student' },
      { status: 500 }
    );
  }
}