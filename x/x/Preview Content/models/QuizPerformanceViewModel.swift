//
//  QuizPerformanceViewModel.swift
//  x
//
//  Created by Hackathon on 7/2/2025.
//

import Foundation

@MainActor
class QuizPerformanceViewModel: ObservableObject {
    @Published var quizPerformance: QuizPerformance?
    @Published var isLoading = false
    @Published var error: NetworkError?

    private let networkManager = NetworkManager.shared

    // Fetch quiz performance for a specific quiz and student
    func fetchQuizPerformance(quizId: String, studentId: String) async {
        isLoading = true
        error = nil

        do {
            // Construct the URL for the API endpoint
            let urlString = "\(Configuration.shared.baseURL)/quiz/\(quizId)/results/\(studentId)"
            guard let url = URL(string: urlString) else {
                throw NetworkError.invalidURL
            }

            // Fetch the quiz performance data
            let quizPerformance: QuizPerformance = try await networkManager.get(url: url)
            self.quizPerformance = quizPerformance
        } catch let networkError as NetworkError {
            self.error = networkError
        } catch {
            self.error = .unknown(error)
        }

        isLoading = false
    }
}
