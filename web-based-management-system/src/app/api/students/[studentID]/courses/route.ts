import { StudentService } from '@/app/services/StudentServices';
import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch a student by studentId
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ studentID: string }> }
) {
    try {
  
      const { studentID } = await params;

      const studentService = new StudentService(studentID);
  
      // Find the student by studentId using findOne
      const courses = await studentService.getCourses();
  
      return NextResponse.json(courses);
  
    } catch (error) {
        console.log(error);

      return NextResponse.json(
          { error: 'Failed to fetch student' },
          { status: 500 }
      );
    }
  }