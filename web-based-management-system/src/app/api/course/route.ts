import connect from '@/app/utils/startMongo';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const courseID = searchParams.get("courseCode");

  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('courses');

    let courses;
    if (!courseID) {
        courses = await collection.find().toArray();
    } else {
        courses = await collection.findOne({ courseCode: courseID });
    }

    if (!courses) {
        return NextResponse.json(
            { error: 'course not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(courses);

  } catch (error) {
    return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Convert string IDs to ObjectIds
    if (data._id) {
      data._id = new ObjectId(data._id);
    }

    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const collection = db.collection('courses');

    const result = await collection.insertOne(data);

    return NextResponse.json(
      { 
        success: true, 
        insertedId: result.insertedId 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}