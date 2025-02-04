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
            
            Text("Error loading data")
                .font(.headline)
            
            Text(error.localizedDescription)
                .font(.caption)
                .foregroundColor(.secondary)
            
            Button("Retry", action: retryAction)
                .buttonStyle(.borderedProminent)
        }
        .padding()
        .background(.black.opacity(0.50))
        .cornerRadius(24)
    }
}

#Preview {
    ErrorView(error: NetworkError.invalidURL, retryAction: {
        print("Retrying ...")
    })
}


