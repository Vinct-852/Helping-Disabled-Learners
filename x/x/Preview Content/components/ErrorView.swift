//
//  ErrorView.swift
//  x
//
//  Created by Hackathon on 4/2/2025.
//
import SwiftUI

struct ErrorView: View {
    let error: NetworkError
    let retryAction: () -> Void
    
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.largeTitle)
                .foregroundColor(.red)
            
            // Conditional error message based on the error type
            switch error {
            case .invalidURL:
                Text("Invalid URL")
                    .font(.headline)
                Text("The provided URL is not valid. Please check the endpoint.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
            case .invalidResponse:
                Text("Invalid Response")
                    .font(.headline)
                Text("The server returned an invalid response. Please try again later.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
            case .statusCode(let code):
                Text("Server Error")
                    .font(.headline)
                Text("The server returned an error with status code: \(code).")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
            case .decodingFailed:
                Text("Decoding Error")
                    .font(.headline)
                Text("Failed to decode the response. Please check the data format.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
            case .unknown(let underlyingError):
                Text("Unknown Error")
                    .font(.headline)
                Text("An unexpected error occurred: \(underlyingError.localizedDescription)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            // Retry button
            Button("Retry", action: retryAction)
                .buttonStyle(.borderedProminent)
        }
        .padding()
        .multilineTextAlignment(.center)
    }
}

#Preview {
    ErrorView(error: NetworkError.invalidURL, retryAction: {
        print("Retrying ...")
    })
}


