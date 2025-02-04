//
//  CourseActivityCardView.swift
//  x
//
//  Created by Hackathon on 29/1/2025.
//

import SwiftUI

struct CourseActivityCardView: View {
    @StateObject private var viewModel = CourseActivityViewModel()
    let activityId: String
    var body: some View {
        VStack{
            if viewModel.isLoading {
                ProgressView("Loading...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if let error = viewModel.error {
                ErrorView(error: error, retryAction: {
                    Task { await viewModel.fetchActivity(activityId: activityId) }
                })
            } else if let activity = viewModel.activity {
                AsyncImage(url: URL(string: "https://res.cloudinary.com/nowo-ltd/image/upload/v1738138068/visionpropro/selective-focus-face-young-asian-boy-girl-smile-having-fun-doing-science-experiment-laboratory-classroom-215712293_x4xezg.webp")) { image in
                    image
                        .resizable()
                        .aspectRatio(16/9, contentMode: .fit)
                } placeholder: {
                    Color.gray // Placeholder while the image is loading
                        .aspectRatio(16/9, contentMode: .fit)
                }
                VStack {
                    Text("20 min")
                        .foregroundColor(.white)
                        .font(.system(size: 24, weight: .regular))
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Text(activity.title)
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding(16)
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
                .stroke(Color.white.opacity(0.25), lineWidth: 3) // Border with 25% opacity
        )
        .task{
            await viewModel.fetchActivity(activityId: activityId)
        }
    }
    
}

