import { StudentService } from '@/app/services/StudentServices';
import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

// GET: Fetch a student by studentId
export async function POST(
    request: NextRequest,
) {
    try {
  
      const { email, password } = await request.json();
      
      
        // Perform authentication and get the user details
        const user = await StudentService.getStudentByEmail(email);
        
        if(!user){
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 401 }
            )
        }
        // Sign a JWT token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Construct the AuthResponse object
        const authResponse = {
            token: token,
            user: user
        };

        return NextResponse.json(authResponse);
  
    } catch (error) {
        console.log(error);

      return NextResponse.json(
          { error: 'Failed to fetch student' },
          { status: 500 }
      );
    }
  }