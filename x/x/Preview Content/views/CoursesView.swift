//
//  CoursesView.swift
//  x
//
//  Created by Hackathon on 29/1/2025.
//

import SwiftUI

struct CoursesView: View {
    var body: some View {
        NavigationStack{
            ScrollView{
                VStack {                    
                    VStack(spacing: 20) {
                        let columns = [
                            GridItem(.flexible(), spacing: 32),
                            GridItem(.flexible(), spacing: 32),
                            GridItem(.flexible(), spacing: 32)
                        ]
                        
                        LazyVGrid(columns: columns, spacing: 20) {
                            ForEach(0..<9) { index in
                                NavigationLink{SingleCourseView(courseIndex: index)} label: {
                                    CourseCardView()
                                }
                                .buttonStyle(PlainButtonStyle())
                                .buttonBorderShape(.roundedRectangle(radius: 0))
                            }
                        }
                        .padding()
                    }
                    Spacer()
                    
                }
                .padding(.horizontal, 64)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .navigationTitle("Courses")
    }
}

#Preview {
    CoursesView()
}
