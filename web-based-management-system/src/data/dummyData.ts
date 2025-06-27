import { Course, MongoQuiz, Question, Option, QuestionType } from '@/types/types';

// Dummy courses data
export const dummyCourses: Course[] = [
  {
    _id: '1',
    courseTitle: 'Introduction to Web Development',
    courseCode: 'WEB101',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    teacherId: 'teacher1',
    immersiveSets: [],
  },
  {
    _id: '2',
    courseTitle: 'Advanced React Techniques',
    courseCode: 'REACT201',
    description: 'Master hooks, context API, and performance optimization',
    teacherId: 'teacher2',
    immersiveSets: [],
  },
  {
    _id: '3',
    courseTitle: 'Data Science Fundamentals',
    courseCode: 'DATA101',
    description: 'Introduction to data analysis and visualization',
    teacherId: 'teacher1',
    immersiveSets: [],
  },
];

// Dummy quizzes data
export const dummyQuizzes: MongoQuiz[] = [
  {
    _id: '1',
    quiz: {
      title: 'Web Development Basics',
      description: 'Test your knowledge of HTML, CSS, and JavaScript fundamentals',
      author: 'John Doe',
      creationDate: '2023-05-15T10:30:00Z',
      category: 'Web Development',
      difficulty: 'Beginner',
      questions: [
        {
          id: 1,
          type: 'multipleChoice',
          question: 'What does HTML stand for?',
          options: [
            { id: 1, text: 'Hyper Text Markup Language' },
            { id: 2, text: 'High Tech Modern Language' },
            { id: 3, text: 'Hyper Transfer Markup Language' },
            { id: 4, text: 'Hybrid Text Manipulation Language' }
          ],
          correctAnswerId: 1
        },
        {
          id: 2,
          type: 'multipleChoice',
          question: 'Which CSS property is used to change the text color?',
          options: [
            { id: 1, text: 'text-color' },
            { id: 2, text: 'color' },
            { id: 3, text: 'font-color' },
            { id: 4, text: 'text-style' }
          ],
          correctAnswerId: 2
        },
        {
          id: 3,
          type: 'matching',
          question: 'Match each HTML element with its purpose',
          pairs: [
            { id: 1, left: '<p>', right: 'Paragraph' },
            { id: 2, left: '<a>', right: 'Link' },
            { id: 3, left: '<img>', right: 'Image' },
            { id: 4, left: '<ul>', right: 'Unordered List' }
          ],
          correctPairs: [
            { leftId: 1, rightId: 1 },
            { leftId: 2, rightId: 2 },
            { leftId: 3, rightId: 3 },
            { leftId: 4, rightId: 4 }
          ]
        }
      ]
    }
  },
  {
    _id: '2',
    quiz: {
      title: 'React Fundamentals',
      description: 'Test your knowledge of React core concepts',
      author: 'Jane Smith',
      creationDate: '2023-06-20T14:15:00Z',
      category: 'Frontend',
      difficulty: 'Intermediate',
      questions: [
        {
          id: 1,
          type: 'multipleChoice',
          question: 'What is JSX?',
          options: [
            { id: 1, text: 'JavaScript XML' },
            { id: 2, text: 'JavaScript Extension' },
            { id: 3, text: 'Java Syntax XML' },
            { id: 4, text: 'JavaScript Extra' }
          ],
          correctAnswerId: 1
        },
        {
          id: 2,
          type: 'ordering',
          question: 'Place these React lifecycle methods in the order they execute',
          items: [
            { id: 1, text: 'componentDidMount' },
            { id: 2, text: 'render' },
            { id: 3, text: 'constructor' },
            { id: 4, text: 'componentDidUpdate' }
          ],
          correctOrder: [3, 2, 1, 4]
        }
      ]
    }
  },
  {
    _id: '3',
    quiz: {
      title: 'Accessibility in Web Design',
      description: 'Learn about making websites accessible to all users',
      author: 'Alex Johnson',
      creationDate: '2023-07-05T09:45:00Z',
      category: 'Web Design',
      difficulty: 'Advanced',
      questions: [
        {
          id: 1,
          type: 'multipleChoice',
          question: 'What does WCAG stand for?',
          options: [
            { id: 1, text: 'Web Content Accessibility Guidelines' },
            { id: 2, text: 'World Content Access Group' },
            { id: 3, text: 'Web Compliance and Access Guide' },
            { id: 4, text: 'Web Content Access Governance' }
          ],
          correctAnswerId: 1
        },
        {
          id: 2,
          type: 'likertScale',
          question: 'Rate your understanding of accessibility principles',
          statement: 'I understand the importance of web accessibility standards.',
          scalePoints: 5,
          scaleLabels: [
            { value: 1, label: 'Strongly Disagree' },
            { value: 2, label: 'Disagree' },
            { value: 3, label: 'Neutral' },
            { value: 4, label: 'Agree' },
            { value: 5, label: 'Strongly Agree' }
          ],
          feedback: {
            "1": "Consider reviewing our accessibility resources to improve your understanding.",
            "2": "There are many benefits to understanding accessibility standards better.",
            "3": "That's a good start. Keep learning about accessibility.",
            "4": "Great! You recognize the importance of accessibility.",
            "5": "Excellent! Your understanding will help create more inclusive web experiences."
          }
        },
        {
          id: 3,
          type: 'multipleChoice',
          question: 'Which attribute should be used on images for accessibility?',
          options: [
            { id: 1, text: 'title' },
            { id: 2, text: 'alt' },
            { id: 3, text: 'description' },
            { id: 4, text: 'caption' }
          ],
          correctAnswerId: 2
        }
      ]
    }
  }
];

// Add more dummy data collections as needed
// export const dummyStudents = [...];
// export const dummyImmersiveSets = [...]; 