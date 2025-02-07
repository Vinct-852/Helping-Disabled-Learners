//
//  LoginView.swift
//  x
//
//  Created by Hackathon on 7/2/2025.
//

import SwiftUI

struct LoginView: View {
    @State private var email = ""
    @State private var password = ""
    @ObservedObject var auth = AuthManager.shared
    @State var isError = false
    
    var body: some View {
        if auth.isAuthenticated {
            CoursesView()
        } else {
            VStack(spacing: 36){
                VStack(spacing: 12){
                    Text("Welcome back")
                        .font(.system(size: 48, weight: .bold))
                    Text("Please enter your account credentials")
                        .font(.system(size: 24))
                }
                
                VStack (spacing: 32){
                    TextField("Email", text: $email)
                        .font(.system(size: 24))
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                    
                    SecureField("Password", text: $password)
                        .font(.system(size: 24))
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                    
                    if isError {
                        Text("Failed to login! Invalid username or password. Please try again")
                            .font(.system(size: 20))
                            .foregroundColor(.red)
                    }
                   
                    
                    Button("Login") {
                        Task {
                            let success = await auth.login(email: email, password: password)
                            if !success {
                                isError = true
                            }
                        }
                    }
                    .font(.system(size: 24, weight: .bold))
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color("darkGreen"))
                    .foregroundColor(.white)
                    .cornerRadius(64)
                    .buttonStyle(PlainButtonStyle())
                }
                .frame(width: 600)
                .padding(96)
                .background(.black.opacity(0.3))
                .cornerRadius(32)
            }
        }
    }
}

#Preview {
    NavigationStack{
        LoginView()
    }
    
}
