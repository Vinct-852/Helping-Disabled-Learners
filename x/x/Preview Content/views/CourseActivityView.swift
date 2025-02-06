//
//  CourseActivityView.swift
//  x
//
//  Created by Hackathon on 30/1/2025.
//

import SwiftUI
import WebKit

struct CourseActivityView: View {
    @StateObject private var viewModel = CourseActivityViewModel()
    let activityId: String
    var body: some View {
        GeometryReader { geometry in
            ScrollView {
                if viewModel.isLoading {
                    ProgressView("Loading...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let error = viewModel.error {
                    ErrorView(error: error, retryAction: {
                        Task { await viewModel.fetchActivity(activityId: activityId) }
                    })
                } else if let activity = viewModel.activity {
                    HStack(alignment: .top, spacing: 24) {
                        // Left Column: Video and Description
                        CourseActivityVideoSection(activity: activity)
                            .frame(width: geometry.size.width * 0.6)
                        
                        // Right Column: Instructions and Quiz Button
                        CourseActivityInstructionsSection(activity: activity)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .padding(32)
                }
                else{
                    Text("Course activity not found")
                }
            }
            .task {
                await viewModel.fetchActivity(activityId: activityId)
            }
        }
        .navigationTitle("Course Activity")
    }
}

// MARK: - Video Section (Left Column)
struct CourseActivityVideoSection: View {
    let activity: CourseActivity
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
//            VideoPlayerView()
//                .aspectRatio(CGSize(width: 16, height: 9), contentMode: .fill)
//                .frame(maxWidth: .infinity)
//                .cornerRadius(24)
            YoutubeVideoPlayeView(videoUrl: activity.video_url)
                .frame(width: .infinity)
                .cornerRadius(24)
            
            VStack(alignment: .leading, spacing: 12) {
                Text(activity.title)
                    .font(.system(size: 40, weight: .bold))
                
                Text("This lecture covers the topics, including definition of interactive proofs (IP), the sum-check Protocol, and the application of interactive proof for #SAT.")
                    .font(.system(size: 28, weight: .regular))
            }
        }
        .padding(24)
        .background(Color.black.opacity(0.25))
        .cornerRadius(32)
        .overlay(
            RoundedRectangle(cornerRadius: 32)
                .stroke(Color.white.opacity(0.10), lineWidth: 3)
        )
    }
}

// MARK: - Instructions Section (Right Column)
struct CourseActivityInstructionsSection: View {
    let activity: CourseActivity
    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            Text("Instructions")
                .font(.system(size: 36, weight: .bold))
            
            VStack {
                Text("This quiz requires you to carefully read each question and select the single correct answer from the provided options.")
                    .font(.system(size: 28, weight: .regular))
                
                VStack(alignment: .leading, spacing: 10) {
                    Text("1. There are no penalties for incorrect answers unless otherwise specified.")
                        .font(.system(size: 28))
                        .padding(.bottom, 5)
                    
                    Text("2. Some quizzes may have a time limit, so ensure you answer promptly if time is restricted.")
                        .font(.system(size: 28))
                        .padding(.bottom, 5)
                    
                    Text("3. Once all questions are completed, your final score will be displayed.")
                        .font(.system(size: 28))
                        .padding(.bottom, 5)
                }
                .padding()
            }
            
            Button(action: {
                NavigationManager.shared.path.append(NavigationDestination.quiz(quizId: activity.quiz))
            }) {
                Text("Start Quiz")
                    .frame(maxWidth: .infinity)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 96)
                    .padding(.vertical, 20)
                    .background(Color.black)
                    .cornerRadius(64)
            }
            .buttonStyle(PlainButtonStyle())
            
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(24)
        .background(Color.black.opacity(0.25))
        .cornerRadius(32)
        .overlay(
            RoundedRectangle(cornerRadius: 32)
                .stroke(Color.white.opacity(0.10), lineWidth: 3)
        )
    }
}

//// MARK: - Preview
//#Preview {
//    NavigationStack {
//        CourseActivityView(activityId: "60c72b2f9b1d4c001f8e4e43")
//    }
//}
