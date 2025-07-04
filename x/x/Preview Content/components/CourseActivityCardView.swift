//
//  CourseActivityCardView.swift
//  x
//
//  Created by Hackathon on 29/1/2025.
//

import SwiftUI

struct CourseActivityCardView: View {
    @StateObject private var viewModel = CourseActivityViewModel()
    @ObservedObject var auth = AuthManager.shared
    let activityId: String
    let coverImage: String?
    
    var body: some View {
        VStack{
            if viewModel.isLoading {
                ProgressView("Loading...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if let error = viewModel.error {
                ErrorView(error: error, retryAction: {
                    Task { await viewModel.fetchActivity(activityId: activityId, studentId: auth.currentUser?._id ?? "xxx") }
                })
            } else if let activity = viewModel.activity {
                ZStack(alignment: .topLeading){
                    AsyncImage(url: URL(string: coverImage ?? "https://res.cloudinary.com/nowo-ltd/image/upload/v1738138068/visionpropro/selective-focus-face-young-asian-boy-girl-smile-having-fun-doing-science-experiment-laboratory-classroom-215712293_x4xezg.webp")) { image in
                        image
                            .resizable()
                            .aspectRatio(16/9, contentMode: .fit)
                    } placeholder: {
                        Color.gray // Placeholder while the image is loading
                            .aspectRatio(16/9, contentMode: .fit)
                    }
                    if activity.completed {
//                    if true {
                        Text("Completed")
                            .padding(.vertical, 12)
                            .padding(.horizontal, 20)
                            .background(Color("darkGreen"))
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                            .cornerRadius(48)
                            .padding()
                    }
                }
                
                VStack(alignment: .leading, spacing: 16) {
                    
                    HStack(spacing: 12) {
                        Image(systemName: "clock")
                            .foregroundColor(.white)
                            .font(.system(size: 24))
                        Text("20 min")
                            .foregroundColor(.white)
                            .font(.system(size: 24, weight: .regular))
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    
                    Text(activity.title)
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    

                }
                .padding(.horizontal, 16)
                .padding(.vertical, 24)
                Spacer()
            }
            else{
                Text("Activity not found")
            }
            
        }
        .frame(maxHeight: .infinity)
        .background(.black.opacity(0.20))
        .cornerRadius(12) // Corner radius
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.white.opacity(0.25), lineWidth: 1) // Border with 25% opacity
        )
        .task{
            await viewModel.fetchActivity(activityId: activityId, studentId: auth.currentUser?._id ?? "xxx")
        }
    }
    
}
#Preview {
    NavigationStack{
        CourseActivityCardView(activityId: "67a65357696bdcb72b794560", coverImage: "https://res.cloudinary.com/nowo-ltd/image/upload/v1742660350/visionpropro/pexels-photo-624063.jpeg_aswzmy.jpg")
    }
    
}

