import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
        
        return NextResponse.json({ isValid: true });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: 'Failed to validate token' },
            { status: 500 }
        );
    }
}