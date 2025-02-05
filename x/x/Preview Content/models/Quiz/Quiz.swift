//
//  Quiz.swift
//  x
//
//  Created by Hackathon on 5/2/2025.
//

import Foundation

// MARK: - QuizResponse
struct QuizResponse: Codable {
    let _id: String
    let quiz: Quiz
    
    enum CodingKeys: String, CodingKey {
        case _id
        case quiz
    }
}

// MARK: - Quiz
struct Quiz: Codable {
    let title: String
    let description: String
    let author: String
    let creationDate: String
    let category: String
    let difficulty: String
    let questions: [Question]
    
    enum CodingKeys: String, CodingKey {
        case title
        case description
        case author
        case creationDate
        case category
        case difficulty
        case questions
    }
}

// MARK: - Question
struct Question: Codable {
    let id: Int
    let question: String
    let options: [Option]
    let correctAnswerId: Int
    
    enum CodingKeys: String, CodingKey {
        case id
        case question
        case options
        case correctAnswerId
    }
}

// MARK: - Option
struct Option: Codable {
    let id: Int
    let text: String
    
    enum CodingKeys: String, CodingKey {
        case id
        case text
    }
}
