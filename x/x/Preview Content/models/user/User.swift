//
//  User.swift
//  x
//
//  Created by Hackathon on 7/2/2025.
//

import Foundation

struct AuthResponse: Codable {
    let token: String
    let user: User
}

struct User: Codable {
    let _id: String
    let id: String
    let firstName: String
    let lastName: String
    let email: String
    
    enum CodingKeys: String, CodingKey {
        case _id
        case id
        case firstName
        case lastName
        case email
    }
}

struct ValidationResponse: Codable {
    let isValid: Bool
    
    enum CodingKeys: String, CodingKey {
        case isValid
    }
}
