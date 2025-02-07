//
//  QuizResultsView.swift
//  x
//
//  Created by Hackathon on 6/2/2025.
//

import SwiftUI

struct QuizPerformanceView: View {
    let quizId: String
    
    let studentId: String = "60c72b2f9b1d4c001f8e4e40"
    
    @StateObject var viewModel = QuizPerformanceViewModel()
    
    var body: some View {
        ScrollView {
            if viewModel.isLoading {
                ProgressView("Loading...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if let error = viewModel.error {
                ErrorView(error: error, retryAction: {
                    Task {
                        await viewModel.fetchQuizPerformance(
                                quizId: quizId,
                                studentId: studentId
                                )
                    }
                })
            } else if let quizPerformance = viewModel.quizPerformance {
                VStack(spacing: 48){
                    Text("\(quizPerformance.percentage, specifier: "%.2f")")
                        .font(.system(size: 48, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.vertical, 24)
                        .padding(.horizontal, 48)
                        .background(.black)
                        .cornerRadius(48)
                    
                    
                    VStack(alignment: .leading, spacing: 32) {
                        ForEach(quizPerformance.questions, id: \.id) { question in
                            
                            QuestionPerformanceView(question: question)
                            // Divider between questions
                            if question.id != quizPerformance.questions.last?.id {
                                Divider()
                                    .background(Color.white.opacity(0.5))
                            }
                        }
                    }
                    .padding()
                }
                .padding(64)
            }
            else{
                Text("No Quiz Results")
                    .foregroundColor(.white)
            }
            
        }
        .navigationTitle("Quiz Performance")
        .task {
            await viewModel.fetchQuizPerformance(quizId: quizId, studentId: studentId)
        }
    }

}


struct QuestionPerformanceView : View {
    let question: ResultQuestion
    var body: some View{
        VStack(alignment: .leading, spacing: 16) {
            // Question Text
            Text(question.text)
                .frame(maxWidth: .infinity)
                .font(.system(size: 36))
                .padding(32)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.white.opacity(0.25), lineWidth: 1)
                        .background(Color.clear)
                )
            
            VStack(spacing: 20) {
                let columns = [
                    GridItem(.flexible(), spacing: 32),
                    GridItem(.flexible(), spacing: 32)
                ]
                
                LazyVGrid(columns: columns, spacing: 20) {
                    ForEach(Array(question.options.enumerated()), id: \.1.id) { index, option in
                        PerformanceQuestionChoice(
                            index: index,
                            option: option,
                            isSelected: question.selectedOptionId == option.id,
                            isCorrect: question.correctOptionId == option.id
                        )
                    }
                }
                .padding()
            }
            
        }
        .padding(24)
        .background(.black.opacity(0.20))
        .cornerRadius(24)
    }
}

struct PerformanceQuestionChoice: View {
    var index: Int
    var option: ResultOption
    var isSelected: Bool
    var isCorrect: Bool
    
    var body: some View{
        HStack {
            // Alphabet Circle (A, B, C, D)
            Text("\(Utils.alphabetForIndex(index))")
                .foregroundColor(.black)
                .frame(width: 64, height: 64, alignment: .center)
                .background(
                    RoundedRectangle(cornerRadius: 48)
                        .fill(Color.white)
                )
            // Option Text
            Text(option.text)
                .font(.system(size: 24))
                .foregroundColor(.white)
        }
        .frame(maxWidth: .infinity, alignment: .leading) // Align text to the left
        .padding(.horizontal, 24) // Add padding on the x-axis
        .padding(.vertical, 16) // Add padding on the y-axis
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(backgroundColor(isSelected: isSelected, isCorrect: isCorrect))
        )
    }
    
    private func backgroundColor(isSelected: Bool, isCorrect: Bool) -> Color {
        if isCorrect {
            return Color("darkGreen")
        } else if isSelected {
            return Color.orange
        }
        else{
            return Color.gray.opacity(0.2)
        }
    }
}


#Preview {
    NavigationStack{ // For glass background in preview
        QuizPerformanceView(quizId: "6798e34e901eefe0e8cbebff")
    }
}

