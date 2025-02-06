// app/api/course/[courseId]/immersive-set

import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  const pathSegments = req.nextUrl.pathname.split('/');
  const courseId = pathSegments[pathSegments.length - 2]; 
  const { immersiveSetId } = await req.json();

  if (!immersiveSetId) {
    return NextResponse.json(
      { error: 'Immersive set ID is required' },
      { status: 400 }
    );
  }

  try {
    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const coursesCollection = db.collection('courses');

    // Validate courseId
    if (!ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID format' },
        { status: 400 }
      );
    }

    // Convert immersiveSetId to ObjectId
    if (!ObjectId.isValid(immersiveSetId)) {
      return NextResponse.json(
        { error: 'Invalid immersive set ID format' },
        { status: 400 }
      );
    }

    const immersiveSetObjectId = new ObjectId(immersiveSetId);

    // Update the course document to add the immersive set ID
    const result = await coursesCollection.updateOne(
      { _id: new ObjectId(courseId) },
      { $addToSet: { immersiveSets: immersiveSetObjectId } } // Store as ObjectId
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update course or no changes made' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Immersive set added to course successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error adding immersive set to course:', error);
    return NextResponse.json(
      { error: 'Failed to add immersive set to course' },
      { status: 500 }
    );
  }
}
