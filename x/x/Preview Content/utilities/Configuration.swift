//
//  Configuration.swift
//  x
//
//  Created by Hackathon on 5/2/2025.
//

import Foundation

class Configuration {
    static let shared = Configuration()
    
    private init() {}
    
    var baseURL: String {
        // Replace with your actual base URL
        return "https://helping-disabled-learners.vercel.app/api"
//        return "http://localhost:3000/api"
    }
}
