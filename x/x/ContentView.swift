//
//  ContentView.swift
//  x
//
//  Created by Hackathon on 24/1/2025.
//

import SwiftUI
import RealityKit
import RealityKitContent

struct ContentView: View {
    
    var body: some View {
        VStack() {
            NavigationStack{
                NavigationLink{
                    CoursesView()
                } label:{
                    Text("Start")
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 64)
                        .padding(.vertical, 24)
                        .background(Color.black)
                        .cornerRadius(72)
                }
                .buttonStyle(PlainButtonStyle())
                
            }
            
            
            
        }

    }
    
}

#Preview(windowStyle: .automatic) {
    ContentView()
        .environment(AppModel())
}


