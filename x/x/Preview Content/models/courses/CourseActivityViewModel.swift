//
//  CourseActivityViewModel.swift
//  x
//
//  Created by Hackathon on 5/2/2025.
//

import Foundation

@MainActor
class CourseActivityViewModel: ObservableObject {
    @Published var activity: CourseActivity?
    @Published var isLoading = false
    @Published var error: NetworkError?
    
    private let networkManager = NetworkManager.shared
    
    // Fetch all activities for a course
    func fetchActivity(activityId: String, studentId: String) async {
        isLoading = true
        error = nil
        
        do {
            // Replace with your actual API endpoint
            let activity: CourseActivity = try await networkManager.get(
                url: URL(string: "\(Configuration.shared.baseURL)/students/\(studentId)/immersiveSets/\(activityId)")
            )
            self.activity = activity
        } catch let networkError as NetworkError {
            self.error = networkError
        } catch {
            self.error = .unknown(error)
        }
        
        isLoading = false
    }
}
