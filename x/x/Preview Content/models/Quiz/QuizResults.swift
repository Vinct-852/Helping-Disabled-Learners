//
//  QuizResults.swift
//  x
//
//  Created by Hackathon on 6/2/2025.
//

import Foundation

struct QuizResults: Codable{
    let quizId: String
    let studentId: String
    let date: Date
    let answers: [Answer]
}

struct Answer: Codable {
    let selectedOptionId: Int
    let questionId: Int
    let isCorrect: Bool
}

struct QuizSubmissionResponse: Codable{
    let _id: String
    
    enum CodingKeys: String, CodingKey{
        case _id
    }
}
