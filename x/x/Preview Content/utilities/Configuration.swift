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
        return "http://172.16.172.23:3000/api"
    }
}
