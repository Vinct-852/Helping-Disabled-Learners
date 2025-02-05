//
//  QuestionFooterView.swift
//  x
//
//  Created by Hackathon on 28/1/2025.
//

import SwiftUI

struct QuestionFooterView: View {
    @Binding var currentQuestionIndex: Int
    var count: Int
    let onSubmit: () -> Void // Closure to handle quiz submission
    
    var body: some View {
        HStack {
            
            Button(action: {
                if currentQuestionIndex > 0 {
                    currentQuestionIndex -= 1
                }
                
            }) {
                Text("Back")
                    .font(.system(size: 24, weight: .bold))
                    .padding(.horizontal, 96)
                    .padding(.vertical, 20)
                    .background(currentQuestionIndex>0 ? Color.black : .white.opacity(0.15))
                    .foregroundColor(.white)
                    .cornerRadius(64)
            }
            .buttonStyle(PlainButtonStyle())
            .disabled(currentQuestionIndex <= 0)
            
            
            Spacer()
            
            Text("\(currentQuestionIndex + 1)/\(count)")
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.white)
                .padding(.vertical, 20)
                .padding(.horizontal, 64)
                .background(.black.opacity(0.20))
                .cornerRadius(24)
            Spacer()
            
            Button(action: {
                if currentQuestionIndex < count - 1 {
                    currentQuestionIndex += 1
                } else{
                    onSubmit()
                }
            }) {
                currentQuestionIndex < count - 1 ?
                Text("Next")
                    .font(.system(size: 24, weight: .bold))
                    .padding(.horizontal, 96)
                    .padding(.vertical, 20)
                    .background(Color.black)
                    .foregroundColor(.white)
                    .cornerRadius(64)
                :
                Text("Submit")
                    .font(.system(size: 24, weight: .bold))
                    .padding(.horizontal, 96)
                    .padding(.vertical, 20)
                    .background(Color("darkGreen"))
                    .foregroundColor(.white)
                    .cornerRadius(64)
            }
            .buttonStyle(PlainButtonStyle())
        }
        .padding(.horizontal, 40)
    }
}
