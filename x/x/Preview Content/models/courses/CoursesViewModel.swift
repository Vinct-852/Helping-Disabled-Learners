//
//  CoursesViewModel.swift
//  x
//
//  Created by Hackathon on 4/2/2025.
//

import Foundation

@MainActor
class CoursesViewModel: ObservableObject {
    @Published var courses: [Course] = []
    @Published var isLoading = false
    @Published var error: NetworkError?
    
    private let networkManager = NetworkManager.shared
    
    func fetchAllCourses() async {
        isLoading = true
        error = nil
        
        do {
//             Replace with your actual API endpoint
            let courses: [Course] = try await networkManager.get(
                url: URL(string: "\(Configuration.shared.baseURL)/course")
            )
            self.courses = courses
//            self.courses = CourseMockData.courses
        } catch let networkError as NetworkError {
            self.error = networkError
        } catch {
            self.error = .unknown(error)
        }
        
        isLoading = false
    }
}
