//
//  xApp.swift
//  x
//
//  Created by Hackathon on 24/1/2025.
//

import SwiftUI

class NavigationManager: ObservableObject {
    @Published var path = NavigationPath()
    
    static let shared = NavigationManager() // Singleton instance
}

enum NavigationDestination: Hashable {
    case courseActivity(activityId: String)
    case quiz(quizId: String)
    case courses
    case performance(quizId: String)
    case singleCourse(courseCode: String)
}


@main
struct xApp: App {

    @State private var appModel = AppModel()
    @StateObject var navigationManager = NavigationManager.shared

    var body: some Scene {
        WindowGroup {
            NavigationStack(path: $navigationManager.path) {
                LoginView()
                    .environment(appModel)
                    .navigationDestination(for: NavigationDestination.self) { destination in
                        switch destination {
                        case .courses:
                            CoursesView()
                        case .singleCourse(let courseCode):
                            SingleCourseView(courseCode: courseCode)
                        case .courseActivity(let activityId):
                            CourseActivityView(activityId: activityId)
                        case .quiz(let quizId):
                            QuizView(quizId: quizId)
                        case .performance(let quizId):
                            QuizPerformanceView(quizId: quizId)
                        }
                        
                    }
            }
        }
        .defaultSize(CGSize(width: 1728, height: 1024))
        .windowResizability(.contentSize)

        ImmersiveSpace(id: appModel.immersiveSpaceID) {
            ImmersiveView()
                .environment(appModel)
                .onAppear {
                    appModel.immersiveSpaceState = .open
                }
                .onDisappear {
                    appModel.immersiveSpaceState = .closed
                }
        }
        .immersionStyle(selection: .constant(.mixed), in: .mixed)
     }
}
