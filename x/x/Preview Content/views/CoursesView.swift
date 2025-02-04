//
//  CoursesView.swift
//  x
//
//  Created by Hackathon on 29/1/2025.
//

import SwiftUI

struct CoursesView: View {
    @StateObject private var viewModel = CoursesViewModel()
    
    var body: some View {
        GeometryReader{ geometry in
            ScrollView{
                VStack {
                    if viewModel.isLoading {
                        ProgressView("Loading...")
                    } else if let error = viewModel.error {
                        ErrorView(error: error, retryAction: {
                            Task { await viewModel.fetchAllCourses() }
                        })
                    } else {
                        let columns = [
                            GridItem(.flexible(), spacing: 32),
                            GridItem(.flexible(), spacing: 32),
                            GridItem(.flexible(), spacing: 32)
                        ]
                        
                        LazyVGrid(columns: columns, spacing: 20) {
                            ForEach(viewModel.courses.indices, id: \.self) { index in
                                NavigationLink {
                                    SingleCourseView(courseIndex: index)
                                } label: {
                                    CourseCardView()
                                }
                                .buttonStyle(PlainButtonStyle())
                                .buttonBorderShape(.roundedRectangle(radius: 0))
                            }
                        }
                        .padding()
                        Spacer()
                    }
                    
                }
                .padding(.horizontal, 64)
                .frame(maxWidth: .infinity, minHeight: geometry.size.height, maxHeight: .infinity)
            }
        }
        .navigationTitle("Courses")
        .task {
            await viewModel.fetchAllCourses()
        }
    }
}

#Preview {
    NavigationStack{
        CoursesView()
    }
    
}
