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
    
    var body: some View {
        HStack {
            if currentQuestionIndex > 0 {
                    Button(action: {
                        currentQuestionIndex -= 1
                    }) {
                        Text("Back")
                            .padding(.horizontal, 48)
                            .padding(.vertical, 20)
                            .background(Color.black)
                            .foregroundColor(.white)
                            .cornerRadius(64)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            
            Spacer()
            
            Button(action: {
                if currentQuestionIndex < count - 1 {
                    currentQuestionIndex += 1
                } else{
                    // do something for submission
                }
            }) {
                currentQuestionIndex < count - 1 ?
                Text("Next")
                    .padding(.horizontal, 48)
                    .padding(.vertical, 20)
                    .background(Color.black)
                    .foregroundColor(.white)
                    .cornerRadius(64)
                :
                Text("Submit")
                    .padding(.horizontal, 48)
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
