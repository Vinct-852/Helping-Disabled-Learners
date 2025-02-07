//
//  SingleCourseViewModel.swift
//  x
//
//  Created by Hackathon on 3/2/2025.
//
import Foundation

@MainActor
class CourseDetailsViewModel: ObservableObject {
    @Published var course: Course?
    @Published var isLoading = false
    @Published var error: NetworkError?
    
    private let networkManager = NetworkManager.shared
    
    func fetchCourse(byCourseCode courseCode: String) async {
        isLoading = true
        error = nil
        
        do {
            // Replace with your actual API endpoint
            let course: Course = try await networkManager.get(
                url: URL(string: "\(Configuration.shared.baseURL)/course/?courseCode=\(courseCode)"),
                headers: ["Authorization": "Bearer YOUR_TOKEN"]
            )
            self.course = course
        } catch let networkError as NetworkError {
            self.error = networkError
        } catch {
            self.error = .unknown(error)
        }
        
        isLoading = false
    }
}
