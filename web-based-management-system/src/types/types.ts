import { ObjectId } from "mongodb";

export interface MongoQuiz {
  _id: string;
  quiz: Quiz;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  correctAnswerId: number;
}

export interface Option {
  id: number;
  text: string;
}

export interface Class{
  name: string;
  students: Student[];
}

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  courses: { $oid: string }[];
  id: string;
}

export interface Quiz {
  title: string;
  description: string;
  author: string;
  creationDate: string;
  category: string;
  difficulty: string;
  questions: Question[];
}

export interface ImmersiveSet {
  _id: string;
  title: string;
  video_url: string;
  topics?: string[];
  quiz?: ObjectId;
  videoType?: 'youtube' | 'upload' | 'vr';
  videoFile?: File;
  completed?: Boolean;
}

export interface Course {
  _id: string;
  courseTitle: string;
  courseCode: string;
  description: string;
  teacherId: string;
  immersiveSets: ObjectId[];
}