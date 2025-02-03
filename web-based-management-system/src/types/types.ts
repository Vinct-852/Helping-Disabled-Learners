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
  firstName: string;
  lastName: string;
  class: string;
  email: string;
  courses: Course[];
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
  videoUrl: string;
  topics?: string[];
  quiz?: Quiz;
}

export interface Course {
  _id: string;
  courseTitle: string;
  courseCode: string;
  description: string;
  teacherId: string;
  immersiveSets: ImmersiveSet[];
}