//
//  CoursesView.swift
//  x
//
//  Created by Hackathon on 29/1/2025.
//

import SwiftUI

struct CoursesView: View {
    @StateObject private var viewModel = CoursesViewModel()
    @ObservedObject var auth = AuthManager.shared
    
    var body: some View {
        GeometryReader{ geometry in
            
            ScrollView{
                VStack (spacing: 32){
                    if viewModel.isLoading {
                        ProgressView("Loading...")
                    } else if let error = viewModel.error {
                        ErrorView(error: error, retryAction: {
                            Task { await viewModel.fetchAllCourses(studentId: auth.currentUser?._id ?? "") }
                        })
                    } else {
                        Jumbotron()
                        
                        CoursesGridView(courses: viewModel.courses)
                        
                        Spacer()
                    }
                    
                }
                .padding(.vertical, 32)
                .padding(.horizontal, 64)
                .frame(maxWidth: .infinity, minHeight: geometry.size.height, maxHeight: .infinity)
            }
        }
        .task {
            await viewModel.fetchAllCourses(studentId: auth.currentUser?._id ?? "xxx")
        }
    }
}

struct CoursesGridView: View {
    let courses: [Course]
    let courseImages = [
        "https://res.cloudinary.com/nowo-ltd/image/upload/v1742660350/visionpropro/pexels-photo-624063.jpeg_aswzmy.jpg",
        "https://res.cloudinary.com/nowo-ltd/image/upload/v1742660343/visionpropro/pexels-photo-132477.jpeg_iugmpp.jpg",
        "https://res.cloudinary.com/nowo-ltd/image/upload/v1742660271/visionpropro/1323080-3840x2160-desktop-4k-science-background-image_p0lzjl.jpg",
        "https://res.cloudinary.com/nowo-ltd/image/upload/v1742660235/visionpropro/beakers-for-science-with-water_pbfumy.jpg"
    ]
    var body: some View {
        VStack {
            let columns = [
                GridItem(.flexible(), spacing: 32),
                GridItem(.flexible(), spacing: 32),
                GridItem(.flexible(), spacing: 32)
            ]
            
            LazyVGrid(columns: columns, spacing: 20) {
                ForEach(Array(courses.enumerated()), id: \.offset) { index, course in
                    Button(action: {
                        NavigationManager.shared.path.append(NavigationDestination.singleCourse(courseCode: course.courseCode))
                    }){
                        CourseCardView(course: course, coverImage: courseImages[index % courseImages.count])
                    }
                    .buttonStyle(PlainButtonStyle())
                    .buttonBorderShape(.roundedRectangle(radius: 0))
                }
            }
            .padding()
        }
        .padding(32)
        .background(.black.opacity(0.20))
        .cornerRadius(24)
    }
}

struct Jumbotron: View {
    @ObservedObject var auth = AuthManager.shared
    var body: some View {
        ZStack {
            // Background Image
            AsyncImage(url: URL(string: "https://res.cloudinary.com/nowo-ltd/image/upload/v1738947701/visionpropro/library-study-wallpaper-preview_n9k6du.jpg")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(height: 250)
                    .clipped()
                    .cornerRadius(24)
            } placeholder: {
                Color.gray
                    .frame(height: 250)
                    .cornerRadius(24)
            }
            
            // Black Overlay
            Color.black.opacity(0.7)
                .cornerRadius(24)
            
            // Text Overlay
            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 16){
                    Text("Courses")
                        .font(.system(size: 48, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.bottom, 4)
                    Spacer()
                    
                    Button("Logout"){
                        auth.logout()
                    }
                    .font(.system(size: 24, weight: .bold))
                    .padding(.horizontal, 32)
                    .padding(.vertical, 12)
                    .foregroundColor(.black)
                    .background(.white)
                    .cornerRadius(96)
                    .buttonStyle(PlainButtonStyle())
                }
                
//                Text("These are courses that were assigned to you in the current semmester. Please go though them")
//                    .font(.system(size: 20, weight: .regular))
//                    .foregroundColor(.white)
//                    .frame(maxWidth: 800, alignment: .leading)
                
                Spacer()

            }
            .padding(32)
        }
        .frame(height: 250)
        .cornerRadius(24)
    }
}

#Preview {
    NavigationStack{
        CoursesView()
    }
    
}
