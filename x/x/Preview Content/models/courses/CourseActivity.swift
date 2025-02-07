//
//  CourseActivity.swift
//  x
//
//  Created by Hackathon on 4/2/2025.
//

import Foundation

struct CourseActivity: Codable {
    let _id: String
    let title: String
    let video_url: String
    let quiz: String
    let topics: [String]
    let completed: Bool
}

