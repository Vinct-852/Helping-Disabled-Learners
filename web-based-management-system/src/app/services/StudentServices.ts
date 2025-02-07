import connect from '@/app/utils/startMongo';
import { Course, Student } from '@/types/types';
import { ObjectId } from 'mongodb';

type StudentObject = {
    _id: ObjectId
    id: string
    firstName: string
    lastName: string
    email: string
    courses: string[]
}

const client = await connect;
const db = client.db('Teacher-Management-System');

export class StudentService {
    private studentId: string
    constructor(studentId: string){
        this.studentId = studentId;
    }

    async getStudent(): Promise<StudentObject | null> {
        const collection = db.collection('student');
        // Find the student by studentId using findOne
        const student = await collection.findOne({ _id: new ObjectId(this.studentId)});
    
        if (!student) {
            return null
        }
    
        return student as StudentObject
    }

    async getCourses(): Promise<Course[]> {
        const coursesCollection = db.collection('courses');
        const student = await this.getStudent();

        if(!student){
            throw new Error("Student does not exist")
        }

        const courseIds = student.courses;

        const courses = await Promise.all( courseIds.map(async (courseId: string)=>{
            const course = await coursesCollection.findOne({_id: new ObjectId(courseId)});
            if (!course) {
                throw new Error(`Course with id ${courseId} not found`);
            }
            return course as unknown as Course;
        }));

        return courses;
    }
}