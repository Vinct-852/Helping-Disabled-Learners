import { ImmersiveSetsService } from '@/app/services/ImmersiveSetsService';
import { StudentService } from '@/app/services/StudentServices';
import connect from '@/app/utils/startMongo';
import { error } from 'console';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ studentID: string, immersiveSetId: string }> }
) {
    try {

        const client = await connect;
        const db = client.db('Teacher-Management-System');

        const quizResultsCollection = db.collection("quizzes-results");

        const { studentID, immersiveSetId } = await params;

        const immersiveSetService = new ImmersiveSetsService(immersiveSetId);

        const immersiveSet = await immersiveSetService.getImmersiveSet();

        if(!immersiveSet){
            return NextResponse.json({error: "Immersive set not found", status: 404})
        }

        const quizResult = await quizResultsCollection.findOne({
            quizId: typeof immersiveSet.quiz == "string" ? new ObjectId(immersiveSet.quiz) : immersiveSet.quiz, 
            studentId: studentID
        });

        console.log({quizId: immersiveSet.quiz, studentId: studentID});
        

        if(quizResult){
            immersiveSet.completed = true;
        }
        else{
            immersiveSet.completed = false;
        }

        return NextResponse.json(immersiveSet);

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: 'Failed to fetch student' },
            { status: 500 }
        );
    }
}