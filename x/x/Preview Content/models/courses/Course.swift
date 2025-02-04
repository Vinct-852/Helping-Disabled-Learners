//
//  Course.swift
//  x
//
//  Created by Hackathon on 31/1/2025.
//

import Foundation

struct Course: Decodable, Identifiable {
    let id: String
    let courseTitle: String
    let courseCode: String
    let description: String
    let teacherId: String
    let immersiveSets: [String]
}

struct CourseMockData {
    
    static let sampleCourse = Course(
        id: "0001",
        courseTitle: "Introduction to Science",
        courseCode: "S101",
        description: "This course provides an introduction to the fundamentals of science.",
        teacherId: "0001",
        immersiveSets: ["String"]
    )
    
    static let courses = [sampleCourse, sampleCourse, sampleCourse, sampleCourse, sampleCourse, sampleCourse, sampleCourse, sampleCourse, sampleCourse]
}
