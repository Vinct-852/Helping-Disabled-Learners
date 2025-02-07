//
//  KeyChainManager.swift
//  x
//
//  Created by Hackathon on 7/2/2025.
//

import Foundation
import Security

final class KeychainManager {
    static let shared = KeychainManager()
    
    private init() {}
    
    // MARK: - Keychain Operations
    
    func saveToken(_ token: String, forAccount account: String) -> Bool {
        guard let tokenData = token.data(using: .utf8) else { return false }
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: account,
            kSecValueData as String: tokenData,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlocked
        ]
        
        SecItemDelete(query as CFDictionary)
        return SecItemAdd(query as CFDictionary, nil) == errSecSuccess
    }
    
    func getToken(forAccount account: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var dataTypeRef: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
        
        guard status == errSecSuccess,
              let data = dataTypeRef as? Data,
              let token = String(data: data, encoding: .utf8)
        else { return nil }
        
        return token
    }
    
    func deleteToken(forAccount account: String) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: account
        ]
        
        return SecItemDelete(query as CFDictionary) == errSecSuccess
    }
}
