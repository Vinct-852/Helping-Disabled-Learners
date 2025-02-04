//
//  SingleCourseView.swift
//  x
//
//  Created by Hackathon on 29/1/2025.
//

import SwiftUI

struct SingleCourseView: View {
    var courseIndex: Int
    var body: some View {
        NavigationStack{
            ScrollView{
                VStack(spacing: 32) {
                    ZStack {
                        AsyncImage(url: URL(string: "https://res.cloudinary.com/nowo-ltd/image/upload/v1738138068/visionpropro/selective-focus-face-young-asian-boy-girl-smile-having-fun-doing-science-experiment-laboratory-classroom-215712293_x4xezg.webp")) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill) // Use .fill to cover the area
                                .frame(height: 400)
                                .clipped() // Clip the image to the frame
                                .cornerRadius(24)
                        } placeholder: {
                            Color.gray
                                .aspectRatio(16/9, contentMode: .fit) // Use a common aspect ratio like 16:9
                                .frame(height: 400)
                                .cornerRadius(24)
                        }
                        
                        // Black overlay with 60% opacity
                        Color.black.opacity(0.7)
                            .cornerRadius(24)
                        
                        // Text overlay
                        VStack(spacing: 4) {
                            Spacer()
                            Text("Introduction to Science")
                                .font(.system(size: 32, weight:.bold))
                                .foregroundColor(.white)
                                .padding(.bottom, 4)
                                .frame(maxWidth: .infinity, alignment: .leading)
                            
                            Text("This course provides an introduction to the fundamentals of science.")
                                .font(.system(size: 20, weight: .regular))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                        .padding(32)
                    }
                    .frame(height: 400) // Ensure the ZStack has a consistent height
                    .cornerRadius(24)
                    
                    VStack{
                        Text("Course Activities")
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .foregroundColor(.white)
                            .font(.system(size: 24, weight: .medium))
                        
                        VStack(spacing: 20) {
                            let columns = [
                                GridItem(.flexible(), spacing: 32),
                                GridItem(.flexible(), spacing: 32),
                                GridItem(.flexible(), spacing: 32)
                            ]
                            
                            LazyVGrid(columns: columns, spacing: 20) {
                                ForEach(0..<3) { index in
                                    NavigationLink{CourseActivityView()} label: {
                                        CourseActivityCardView()                                }
                                    .buttonStyle(PlainButtonStyle())
                                    .buttonBorderShape(.roundedRectangle(radius: 0))
                                }
                                
                                
                            }
                        }
                        
                    }
                    .padding(32)
                    .background(.white.opacity(0.15))
                    .cornerRadius(24)
                    
                    Spacer()
                    
                }
                .padding(.horizontal, 64)
//                .background(.red)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .navigationTitle("Introduction to Science")
    }
}

#Preview {
    SingleCourseView(courseIndex: 1)
}
