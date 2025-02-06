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
                url: URL(string: "\(Configuration.shared.baseURL)/quiz?_id=\(quizId)")
            )
            self.quizResponse = quizResponse
        } catch let networkError as NetworkError {
            self.error = networkError
        } catch {
            self.error = .unknown(error)
        }
        
        isLoading = false
    }
    
    // Submit quiz results
    func submitQuiz(quizResults: QuizResults) async {
        isLoading = true
        error = nil
        
        do {
            // Encode the QuizResults to Data
            let jsonData = try JSONEncoder().encode(quizResults)
            
            // Convert Data to a JSON dictionary
            if let jsonObject = try JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any] {
                // Replace with your actual API endpoint
                let _: QuizSubmissionResponse = try await networkManager.post(
                    url: URL(string: "\(Configuration.shared.baseURL)/quiz/\(quizResults.quizId)"),
                    parameters: jsonObject,
                    headers: ["Content-Type": "application/json"]
                )
            } else {
                print("Failed to convert JSON data to dictionary")
            }
        } catch let networkError as NetworkError {
            self.error = networkError
        } catch {
            self.error = .unknown(error)
        }
        
        isLoading = false
    }
}
