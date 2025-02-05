//
//  QuizViewModel.swift
//  x
//
//  Created by Hackathon on 5/2/2025.
//

import Foundation

@MainActor
class QuizViewModel: ObservableObject {
    
    @Published var quizResponse: QuizResponse?
    @Published var isLoading = false
    @Published var error: NetworkError?
    
    private let networkManager = NetworkManager.shared
    
    // Fetch a quiz by its ID
    func fetchQuiz(quizId: String) async {
        isLoading = true
        error = nil
        
        do {
            // Replace with your actual API endpoint
            let quizResponse: QuizResponse = try await networkManager.get(
                url: URL(string: "http://localhost:3000/api/quiz?_id=\(quizId)")
            )
            self.quizResponse = quizResponse
        } catch let networkError as NetworkError {
            self.error = networkError
        } catch {
            self.error = .unknown(error)
        }
        
        isLoading = false
    }
}
