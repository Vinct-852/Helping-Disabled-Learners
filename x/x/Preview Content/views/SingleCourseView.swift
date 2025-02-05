//
//  SingleCourseView.swift
//  x
//
//  Created by Hackathon on 29/1/2025.
//

import SwiftUI

struct SingleCourseView: View {
    var courseCode: String
    @StateObject private var viewModel = CourseDetailsViewModel()
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 32) {
                    // Loading State
                    if viewModel.isLoading {
                        ProgressView("Loading...")
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                    }
                    // Error State
                    else if let error = viewModel.error {
                        ErrorView(error: error, retryAction: {
                            Task { await viewModel.fetchCourse(byCourseCode: courseCode) }
                        })
                    }
                    // Success State
                    else if let course = viewModel.course {
                        CourseHeaderView(course: course)
                        CourseActivitiesView(course: course)
                    }
                    // Fallback State (Course Not Found)
                    else {
                        Text("Course Not Found")
                            .font(.title)
                            .foregroundColor(.white)
                    }
                }
                .padding(.horizontal, 64)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .navigationTitle("Course Details")
        .task {
            await viewModel.fetchCourse(byCourseCode: courseCode)
        }
    }
}

// MARK: - Course Header View (Reusable Component)
struct CourseHeaderView: View {
    let course: Course
    
    var body: some View {
        ZStack {
            // Background Image
            AsyncImage(url: URL(string: "https://res.cloudinary.com/nowo-ltd/image/upload/v1738138068/visionpropro/selective-focus-face-young-asian-boy-girl-smile-having-fun-doing-science-experiment-laboratory-classroom-215712293_x4xezg.webp")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(height: 300)
                    .clipped()
                    .cornerRadius(24)
            } placeholder: {
                Color.gray
                    .frame(height: 300)
                    .cornerRadius(24)
            }
            
            // Black Overlay
            Color.black.opacity(0.7)
                .cornerRadius(24)
            
            // Text Overlay
            VStack(spacing: 4) {
                Spacer()
                Text(course.courseTitle ?? "No Title Available")
                    .font(.system(size: 48, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.bottom, 4)
                
                Text(course.description ?? "No description available")
                    .font(.system(size: 20, weight: .regular))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(32)
        }
        .frame(height: 300)
        .cornerRadius(24)
    }
}

// MARK: - Course Activities View (Reusable Component)
struct CourseActivitiesView: View {
    let course: Course
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Course Activities")
                .frame(maxWidth: .infinity, alignment: .leading)
                .foregroundColor(.white)
                .font(.system(size: 32, weight: .bold))
            
            let columns = [
                GridItem(.flexible(), spacing: 32),
                GridItem(.flexible(), spacing: 32),
                GridItem(.flexible(), spacing: 32)
            ]
            
            LazyVGrid(columns: columns, spacing: 20) {
                ForEach(course.immersiveSets, id: \.self) { activityId in
                    NavigationLink {
                        CourseActivityView(activityId: activityId)
                    } label: {
                        CourseActivityCardView(activityId: activityId)
                    }
                    .buttonStyle(PlainButtonStyle())
                    .buttonBorderShape(.roundedRectangle(radius: 0))
                }
            }
        }
        .padding(32)
        .background(.white.opacity(0.15))
        .cornerRadius(24)
    }
}

// MARK: - Preview
struct SingleCourseView_Previews: PreviewProvider {
    static var previews: some View {
        SingleCourseView(courseCode: "S101")
    }
}
