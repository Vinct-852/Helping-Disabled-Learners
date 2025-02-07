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
        return "http://192.168.131.104:3000/api"
    }
}
