//
//  QuizResults.swift
//  x
//
//  Created by Hackathon on 7/2/2025.
//

import Foundation

struct QuizPerformance {
    var _id: String
    var percentage: Double
    var questions: [ResultQuestion]
}

struct ResultQuestion {
    var id: Int
    var text: String
    var options: [ResultOption]
    var correctOptionId: Int
    var selectedOptionId: Int
    var isCorrect: Bool
}

struct ResultOption{
    var id: Int
    var text: String
}

struct MockQuizPerformance{

    // Sample QuizPerformance Data
    static let sampleQuizPerformance = QuizPerformance(
        _id: "quiz_123",
        percentage: 66.67, // Example percentage
        questions: [
            ResultQuestion(
                id: 1,
                text: "What is the capital of France?",
                options: [
                    ResultOption(id: 1, text: "Paris"),
                    ResultOption(id: 2, text: "London"),
                    ResultOption(id: 3, text: "Berlin"),
                    ResultOption(id: 4, text: "Madrid")
                ],
                correctOptionId: 1,
                selectedOptionId: 1,
                isCorrect: true
            ),
            ResultQuestion(
                id: 2,
                text: "Which planet is known as the Red Planet?",
                options: [
                    ResultOption(id: 1, text: "Earth"),
                    ResultOption(id: 2, text: "Mars"),
                    ResultOption(id: 3, text: "Jupiter"),
                    ResultOption(id: 4, text: "Venus")
                ],
                correctOptionId: 2,
                selectedOptionId: 3,
                isCorrect: false
            ),
            ResultQuestion(
                id: 3,
                text: "What is the largest ocean on Earth?",
                options: [
                    ResultOption(id: 1, text: "Atlantic Ocean"),
                    ResultOption(id: 2, text: "Indian Ocean"),
                    ResultOption(id: 3, text: "Pacific Ocean"),
                    ResultOption(id: 4, text: "Arctic Ocean")
                ],
                correctOptionId: 3,
                selectedOptionId: 3,
                isCorrect: true
            )
        ]
    )
}
