//
//  File.swift
//  x
//
//  Created by Hackathon on 7/2/2025.
//

import Foundation

class UserManager: ObservableObject{
    static let shared: UserManager = UserManager()
    
    @Published var studentId: String?
    
    private init(){
        self.studentId = "67a52e13579c155f9f698b9b"
    }
}
