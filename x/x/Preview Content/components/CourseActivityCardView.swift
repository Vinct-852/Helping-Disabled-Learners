//
//  CourseActivityCardView.swift
//  x
//
//  Created by Hackathon on 29/1/2025.
//

import SwiftUI

struct CourseActivityCardView: View {
    var body: some View {
        VStack{
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
                Text("Chemical Reactions")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(16)
            
            
        }
        .background(.black.opacity(0.20))
        .cornerRadius(12) // Corner radius
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.white.opacity(0.25), lineWidth: 3) // Border with 25% opacity
        )
    }
}

