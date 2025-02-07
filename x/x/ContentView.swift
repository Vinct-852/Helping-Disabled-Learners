//import SwiftUI
//import RealityKit
//import RealityKitContent
//
//struct ContentView: View {
//    @StateObject var navigationManager = NavigationManager.shared
//
//    var body: some View {
//        NavigationStack(path: $navigationManager.path) { // NavigationStack must wrap the content
//            VStack {
//                Button(action: {
//                    navigationManager.path.append(NavigationDestination.courses)
//                }) {
//                    Text("Start")
//                        .font(.system(size: 32, weight: .bold))
//                        .foregroundColor(.white)
//                        .padding(.horizontal, 64)
//                        .padding(.vertical, 24)
//                        .background(Color.black)
//                        .cornerRadius(72)
//                }
//                .buttonStyle(PlainButtonStyle())
//            }
//            .navigationDestination(for: NavigationDestination.self) { destination in
//                switch destination {
//                case .courses:
//                    CoursesView()
//                case .courseActivity(let activityId):
//                    CourseActivityView(activityId: activityId)
//                case .quiz(let quizId):
//                    QuizView(quizId: quizId)
//                case .performance(let quizId):
//                    QuizPerformanceView(quizId: quizId)
//                }
//                
//            }
//        }
//    }
//}
//
//enum NavigationDestination: Hashable {
//    case courseActivity(activityId: String)
//    case quiz(quizId: String)
//    case courses
//    case performance(quizId: String)
//}
