import { ObjectId } from "mongodb";

export interface MongoQuiz {
  _id: string;
  quiz: Quiz;
}

// Base question interface
export interface BaseQuestion {
  id: number;
  type: QuestionType;
  question: string;
}

export type QuestionType = 'multipleChoice' | 'matching' | 'ordering' | 'likertScale';

// Multiple Choice Question
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multipleChoice';
  options: Option[];
  correctAnswerId: number;
}

// Matching Question
export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
  correctPairs: MatchingAnswer[];
}

export interface MatchingPair {
  id: number;
  left: string;
  right: string;
}

export interface MatchingAnswer {
  leftId: number;
  rightId: number;
}

// Ordering Question
export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  items: OrderingItem[];
  correctOrder: number[];
}

export interface OrderingItem {
  id: number;
  text: string;
}

// Likert Scale Question
export interface LikertScaleQuestion extends BaseQuestion {
  type: 'likertScale';
  statement: string;
  scalePoints: number;
  scaleLabels: ScaleLabel[];
  feedback?: Record<string, string>;
}

export interface ScaleLabel {
  value: number;
  label: string;
}

// Original Option interface for multiple choice
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

// Updated Question type to be a union of all question types
export type Question = MultipleChoiceQuestion | MatchingQuestion | OrderingQuestion | LikertScaleQuestion;

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