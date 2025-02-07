import connect from '@/app/utils/startMongo';
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string, quizID: string}> }
) {
  try {
    const { quizID, studentId } = await params

    const client = await connect;
    const db = client.db('Teacher-Management-System');
    const quizResultsCollection = db.collection('quizzes-results');
    const quizzesCollection = db.collection('quizs');

    console.log({studentId, quizID});
    
    // Fetch the quiz result
    const quizResult = await quizResultsCollection.findOne({ quizId: new ObjectId(quizID), studentId: studentId });
    if (!quizResult) {
      return NextResponse.json({ error: 'Quiz result not found' }, { status: 404 });
    }

    console.log({quiz: quizResult.quizId});
    
    // Fetch the quiz details
    const quiz = await quizzesCollection.findOne({ _id: new ObjectId(quizID)});
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Calculate the performance
    const totalQuestions = quiz.quiz.questions.length;
    const correctAnswers = quizResult.answers.filter((answer: any) => answer.isCorrect).length;
    const percentage = (correctAnswers / totalQuestions) * 100;

    // Prepare the response
    const questions = quiz.quiz.questions.map((question: any) => {
      const resultAnswer = quizResult.answers.find((answer: any) => answer.questionId === question.id);
      return {
        id: question.id,
        text: question.question,
        options: question.options.map((option: any) => ({
          id: option.id,
          text: option.text
        })),
        correctOptionId: question.correctAnswerId,
        selectedOptionId: resultAnswer ? resultAnswer.selectedOptionId : null,
        isCorrect: resultAnswer ? resultAnswer.isCorrect : false
      };
    });

    const response = {
      _id: quizResult._id.toString(),
      percentage,
      questions
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error('Failed to get quiz performance:', error);
    return NextResponse.json(
      { error: 'Failed to get quiz performance: ' + error.message },
      { status: 500 }
    );
  }
}