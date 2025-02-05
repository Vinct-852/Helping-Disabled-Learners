//
//  QuizView.swift
//  x
//
//  Created by Hackathon on 31/1/2025.
//

import SwiftUI

struct QuizView: View {
    let quizId: String;
    // Define the questions and answers
    let questions = [
        ("Which planet in the Solar System has the largest volcano?", ["Mercury", "Venus", "Earth", "Mars"], "D"),
        ("What is the primary reason for the phases of the Moon as observed from Earth?", ["The Moon's rotation on its axis", "The Earth's rotation on its axis", "The relative positions of the Sun, Earth, and Moon", "Changes in the Moon's distance from the Earth"], "C"),
        ("Which of the following is classified as a dwarf planet in our Solar System?", ["Europa", "Titan", "Ceres", "Ganymede"], "C"),
        ("What is the name of the boundary around a black hole beyond which nothing can escape?", ["Event horizon", "Singularity", "Accretion disk", "Schwarzschild radius"], "A"),
        ("Which planet has the strongest magnetic field in the Solar System?", ["Earth", "Saturn", "Jupiter", "Uranus"], "C"),
        ("What is the approximate age of the Solar System?", ["13.8 billion years", "10 billion years", "4.6 billion years", "1 billion years"], "C"),
        ("Which of the following best describes a light-year?", ["The time it takes for light to travel one year in space", "The distance light travels in one year", "The time it takes for the Sun's light to reach Earth", "The distance between the Earth and the nearest star"], "B"),
        ("Which of these stars is the closest to Earth?", ["Betelgeuse", "Proxima Centauri", "Sirius", "Vega"], "B"),
        ("What is the primary component of the Sun?", ["Oxygen", "Helium", "Hydrogen", "Carbon"], "C"),
        ("What causes a solar eclipse?", ["The Moon passing between the Earth and the Sun", "The Earth passing between the Moon and the Sun", "The Moon passing through the Earth's shadow", "The Sun passing directly behind the Earth"], "A")
    ]
    
    @State private var currentQuestionIndex = 0
    @State private var selectedAnswer = -1
    
    
    var body: some View {
        NavigationStack{
            ScrollView{
                VStack(spacing: 40) {
                    Text(questions[currentQuestionIndex].0)
                        .font(.largeTitle)
                        .foregroundColor(.white)
                        .padding(48)
                        .overlay(
                            RoundedRectangle(cornerRadius: 64)
                                .stroke(.white, lineWidth: 2)
                        )
                        .cornerRadius(64)
                    
                    VStack(spacing: 20) {
                        let columns = [
                            GridItem(.flexible(), spacing: 32),
                            GridItem(.flexible(), spacing: 32)
                        ]
                        
                        LazyVGrid(columns: columns, spacing: 20) {
                            ForEach(0..<questions[currentQuestionIndex].1.count, id: \.self) { index in
                                QuizChoiceView(
                                    index: index,
                                    text: questions[currentQuestionIndex].1[index],
                                    alphabet: String(UnicodeScalar(65 + index)!),
                                    selectedAnswer: $selectedAnswer
                                )
                            }
                        }
                        .padding()
                    }
                    Text("\(selectedAnswer)")
                        .foregroundColor(.black)
                    QuestionFooterView(currentQuestionIndex: $currentQuestionIndex, count: questions.count)
                    
                    
                }
                .padding(40)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .navigationTitle("Quiz")
    }
}

#Preview {
    QuizView(quizId: "6798e34e901eefe0e8cbebff")
}
