//
//  AuthManager.swift
//  x
//
//  Created by Hackathon on 7/2/2025.
//

import Foundation

final class AuthManager: ObservableObject {
    static let shared = AuthManager()
    private let keychain = KeychainManager.shared
    private let keychainAccount = "com.visonpropro.authToken"
    
    @Published var currentUser: User?
    @Published var isAuthenticated = false
    
    private init() {
        if let token = keychain.getToken(forAccount: keychainAccount) {
            Task {
                let isValid = await validateToken(token)
                if isValid {
                    await fetchCurrentUser(token: token)
                }
            }
        }
    }
    
    
    // MARK: - Authentication Methods
    
    func login(email: String, password: String) async -> Bool {
        let credentials = ["email": email, "password": password]
        
        do {
            let response: AuthResponse = try await NetworkManager.shared.post(
                url: URL(string: "\(Configuration.shared.baseURL)/auth/login"),
                parameters: credentials
            )
            
            handleSuccessfulLogin(token: response.token, user: response.user)
            return true
        } catch {
            print("Login error: \(error.localizedDescription)")
            return false
        }
    }
    
    // MARK: - Authentication Methods
    
    func handleSuccessfulLogin(token: String, user: User) {
        _ = keychain.saveToken(token, forAccount: keychainAccount)
        currentUser = user
        isAuthenticated = true
        persistUser(user)
    }
    
    func logout() {
        _ = keychain.deleteToken(forAccount: keychainAccount)
        currentUser = nil
        isAuthenticated = false
    }
    
    
    func validateToken(_ token: String) async -> Bool {
        guard let url = URL(string: "\(Configuration.shared.baseURL)/auth/validate") else {
            return false
        }
        
        let headers = [
            "Authorization": "Bearer \(token)",
            "Content-Type": "application/json"
        ]
        
        do {
            let response: ValidationResponse = try await NetworkManager.shared.get(
                url: url,
                headers: headers
            )
            
            return response.isValid
        } catch {
            return false
        }
    }
    
    func fetchCurrentUser(token: String) async {
        guard let url = URL(string: "\(Configuration.shared.baseURL)/auth/userInfo") else {
            logout()
            return
        }
        
        let headers = [
            "Authorization": "Bearer \(token)",
            "Content-Type": "application/json"
        ]
        
        do {
            let user: User = try await NetworkManager.shared.get(url: url, headers: headers)
            currentUser = user
            isAuthenticated = true
            persistUser(user)
        } catch {
            logout()
        }
    }

    
    // MARK: - User Persistence
    
    private func persistUser(_ user: User) {
        if let data = try? JSONEncoder().encode(user) {
            UserDefaults.standard.set(data, forKey: "currentUser")
        }
    }
    
    private func loadPersistedUser() -> User? {
        guard let data = UserDefaults.standard.data(forKey: "currentUser") else { return nil }
        return try? JSONDecoder().decode(User.self, from: data)
    }
}
