//
//  QuizChoiceView.swift
//  x
//
//  Created by Hackathon on 28/1/2025.
//

import SwiftUI

struct QuizChoiceView: View {
    var index: Int
    var text: String
    var alphabet: String
    @Binding var selectedAnswer: Int

    
    
    var body: some View {
        Button(action: handleClick) {
            HStack(spacing: 20){
                Text(alphabet)
                    .foregroundColor(.black)
                    .frame(width: 64, height: 64, alignment: .center)
                    .background(
                        RoundedRectangle(cornerRadius: 48)
                            .fill(Color.white)
                    )
                Text(text)
                    .font(.system(size: 28))
                    
            }
            .frame(maxWidth: .infinity, alignment: .leading) // Align text to the left
            .padding(.horizontal, 24) // Add padding on the x-axis
            .padding(.vertical, 32) // Add padding on the y-axis
            .background(
                ZStack {
                    if selectedAnswer == index {
                        RoundedRectangle(cornerRadius: 32)
                            .fill(Color("darkGreen"))
                    } else {
                        RoundedRectangle(cornerRadius: 32)
                            .stroke(Color.white, lineWidth: 1)
                    }
                }
                    
            )
            
        }
        .buttonStyle(PlainButtonStyle()) // Removes default button styles
        .buttonBorderShape(.roundedRectangle(radius: 32))

    
    }
    
    func handleClick() {
        selectedAnswer = index
    }
    
}
