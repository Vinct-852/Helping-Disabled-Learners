//
//  ImmersiveManager.swift
//  x
//
//  Created by Hackathon on 8/2/2025.
//

import Foundation


class ImmersiveManager: ObservableObject {
    static let shared = ImmersiveManager() // Singleton instance
    @Published var url: String? // URL to be used in the immersive view
    
    private init() {} // Private initializer for singleton
}
