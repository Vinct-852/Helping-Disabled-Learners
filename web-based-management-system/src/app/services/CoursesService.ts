import connect from '@/app/utils/startMongo';
import { Course, Student } from '@/types/types';
import { ObjectId } from 'mongodb';

const client = await connect;
const db = client.db('Teacher-Management-System');

class CourseService {
    async getCourse(courseId: string): Promise<Course | null > {
        const coursesCollection = db.collection('courses');
        const course = await coursesCollection.findOne({_id: new ObjectId(courseId)});

        if(!course) return null;
        return {
            _id: course._id.toString(),
            courseTitle: course.courseTitle,
            courseCode: course.courseCode,
            description: course.description,
            teacherId: course.teacherId,
            immersiveSets: course.immersiveSets
        } as Course;
    }
}