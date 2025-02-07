//
//  QuizView.swift
//  x
//
//  Created by Hackathon on 31/1/2025.
//

import SwiftUI

import SwiftUI

struct QuizView: View {
    @StateObject private var viewModel = QuizViewModel()
    let quizId: String
    @ObservedObject var userManager = UserManager.shared
    
    @State private var currentQuestionIndex = 0
    @State private var selectedAnswer = -1
    @State private var userSelections: [Int: Int] = [:]
    @State private var showSubmissionAlert = false
    
    
    var body: some View {
        ZStack {
            GeometryReader { geometry in
                ScrollView {
                    if viewModel.isLoading {
                        ProgressView("Loading...")
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                    } else if let error = viewModel.error {
                        ErrorView(error: error, retryAction: {
                            Task { await viewModel.fetchQuiz(quizId: quizId) }
                        })
                    } else if let quizResponse = viewModel.quizResponse {
                        VStack(spacing: 40) {
                            let questions = quizResponse.quiz.questions
                            if currentQuestionIndex < questions.count {
                                let currentQuestion = questions[currentQuestionIndex]
                                
                                Text(currentQuestion.question)
                                    .font(.system(size: 40))
                                    .foregroundColor(.white)
                                    .padding(48)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 64)
                                            .stroke(.white, lineWidth: 2)
                                    )
                                    .cornerRadius(64)
                                
                                VStack(spacing: 20) {
                                    let columns = [
                                        GridItem(.flexible(), spacing: 32),
                                        GridItem(.flexible(), spacing: 32)
                                    ]
                                    
                                    LazyVGrid(columns: columns, spacing: 20) {
                                        ForEach(currentQuestion.options, id: \.id) { option in
                                            QuizChoiceView(
                                                index: option.id,
                                                text: option.text,
                                                alphabet: String(UnicodeScalar(64 + option.id)!),
                                                selectedAnswer: Binding(
                                                    get: { userSelections[currentQuestion.id] ?? -1 },
                                                    set: { userSelections[currentQuestion.id] = $0 }
                                                )
                                            )
                                        }
                                    }
                                    .padding()
                                }
                                
                                QuestionFooterView(
                                    currentQuestionIndex: $currentQuestionIndex,
                                    count: questions.count,
                                    onSubmit: submitQuiz
                                )
                            } else {
                                Text("No more questions")
                                    .foregroundColor(.white)
                            }
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    } else {
                        Text("Quiz not found")
                    }
                }
                .task {
                    await viewModel.fetchQuiz(quizId: quizId)
                }
                .navigationTitle("Quiz")
            }
            
            if showSubmissionAlert {
                CustomAlertView(
                    title: "Quiz Submitted",
                    message: "Your responses have been submitted successfully.",
                    dismissAction: {
                        showSubmissionAlert = false
                    }
                )
                .transition(.opacity)
                .zIndex(10)
            }
        }
    }
    
    func submitQuiz() {
        Task {
            guard let quizResponse = viewModel.quizResponse else { return }
            
            // Determine if each answer is correct
            let answers = quizResponse.quiz.questions.map { question in
                let selectedOptionId = userSelections[question.id] ?? -1
                let isCorrect = selectedOptionId == question.correctAnswerId
                return Answer(selectedOptionId: selectedOptionId, questionId: question.id, isCorrect: isCorrect)
            }
            
            // Create a QuizResults object
            let quizResults = QuizResults(quizId: quizId, studentId: userManager.studentId ?? "xxx", date: Date(), answers: answers)
            
            // Submit the quiz results
            await viewModel.submitQuiz(quizResults: quizResults)
            showSubmissionAlert = true
            NavigationManager.shared.path.removeLast()
        }
    }
}


struct CustomAlertView: View {
    var title: String
    var message: String
    var dismissAction: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            Text(title)
                .font(.system(size: 32, weight: .bold))
                .multilineTextAlignment(.center)
            
            Text(message)
                .font(.system(size: 28))
                .multilineTextAlignment(.center)
            
            Divider()
            
            Button(action: dismissAction) {
                Text("OK")
                    .font(.system(size: 28, weight: .bold))
                    .padding()
                    .frame(maxWidth: .infinity)
                    .foregroundColor(.white)
            }
        }
        .frame(width: 400)
        .padding(.horizontal, 40)
        .padding(.vertical, 40)
        .background(Color.white.opacity(0.10))
        .cornerRadius(20)
        .shadow(radius: 10)
        .glassBackgroundEffect()
        
    }
}

//#Preview {
//    QuizView(quizId: "6798e34e901eefe0e8cbebff", navigationPath: $testPath)
//}
