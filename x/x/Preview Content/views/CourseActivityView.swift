//
//  CourseActivityView.swift
//  x
//
//  Created by Hackathon on 30/1/2025.
//

import SwiftUI
import WebKit

struct CourseActivityView: View {
    var body: some View {
        NavigationStack{
            GeometryReader { geometry in
                HStack(alignment: .top, spacing: 24){
                    VStack(alignment: .leading, spacing: 8){
                        VideoPlayerView()
                        VStack(alignment: .leading, spacing: 12){
                            Text("Interactive Proofs and the Sum-Check Protocol")
                                .font(.system(size: 40, weight: .bold))
                            Text("This lecture covers the topics, including definition of interactive proofs (IP), the sum-check Protocol, and the application of interactive proof for #SAT.")
                                .font(.system(size: 28, weight: .regular))
                        }
                        
                        
                    }
                    .frame(width: geometry.size.width * 0.6)
                    .padding(24)
                    .background(Color.black.opacity(0.25)) // Set the background color with opacity
                    .cornerRadius(32) // Corner radius
                    .overlay(
                        RoundedRectangle(cornerRadius: 32)
                            .stroke(Color.white.opacity(0.10), lineWidth: 3) // Border with 25% opacity
                    )
                    
                    VStack(alignment: .leading, spacing: 24){
                        Text("Instructions")
                            .font(.system(size: 36, weight: .bold))
                        VStack{
                            Text("This quiz requires you to carefully read each question and select the single correct answer from the provided options.")
                                .font(.system(size: 28, weight: .regular))
                        }
                        
                        NavigationLink {QuizView()} label: {
                            Text("Start Quiz")
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
                    .frame(maxWidth: .infinity, maxHeight: .infinity) // Make the VStack fill the width
                    .padding(24)
                    .background(Color.black.opacity(0.25)) // Set the background color with opacity
                    .cornerRadius(32) // Corner radius
                    .overlay(
                        RoundedRectangle(cornerRadius: 32)
                            .stroke(Color.white.opacity(0.10), lineWidth: 3) // Border with 25% opacity
                    )
                    
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding(32)
            }
            
        }
        .navigationTitle("Course Activity")
    }
    
}

#Preview {
    CourseActivityView()
}
