import { StudentService } from '@/app/services/StudentServices';
import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

// GET: Fetch a student by studentId
export async function GET(
    request: NextRequest,
) {
    try {
        const Authorization = request.headers.get('Authorization');

        // Check if the Authorization header is present
        if (!Authorization || !Authorization.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = Authorization.split(' ')[1];

        console.log(token);


        // Verify the JWT token
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return NextResponse.json({ error: 'JWT secret is not defined' }, { status: 500 });
        }

        const decoded = jwt.verify(token, secret);

        const email = (decoded as jwt.JwtPayload).email;

        const user = await StudentService.getStudentByEmail(email);

        if (!user) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(user);
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: 'Failed to validate token' },
            { status: 500 }
        );
    }
}