//
//  NetworkManager.swift
//  x
//
//  Created by Hackathon on 3/2/2025.
//

import Foundation

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
}

enum NetworkError: Error {
    case invalidURL
    case invalidResponse
    case statusCode(Int)
    case decodingFailed
    case unknown(Error)
}

final class NetworkManager {
    static let shared = NetworkManager()
    private let session: URLSession
    
    init(session: URLSession = .shared) {
        self.session = session
    }
    
    // MARK: - Generic Request Method
    func request<T: Decodable>(
        _ method: HTTPMethod,
        url: URL?,
        parameters: [String: Any]? = nil,
        headers: [String: String]? = nil
    ) async throws -> T {
        guard let url = url else {
            throw NetworkError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        
        // Add headers
        headers?.forEach { key, value in
            request.addValue(value, forHTTPHeaderField: key)
        }
        
        // Add parameters based on method
        switch method {
        case .get:
            if let parameters = parameters {
                var components = URLComponents(url: url, resolvingAgainstBaseURL: false)
                components?.queryItems = parameters.map { URLQueryItem(name: $0.key, value: "\($0.value)") }
                request.url = components?.url
            }
            
        case .post, .put:
            if let parameters = parameters {
                request.httpBody = try? JSONSerialization.data(withJSONObject: parameters)
                request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            }
        }
        
        // Perform request
        do {
            let (data, response) = try await session.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw NetworkError.invalidResponse
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                throw NetworkError.statusCode(httpResponse.statusCode)
            }
            
            let decodedData = try JSONDecoder().decode(T.self, from: data)
            return decodedData
            
        } catch let error as NetworkError {
            throw error
        } catch {
            throw NetworkError.unknown(error)
        }
    }
    
    // MARK: - Convenience Methods
    func get<T: Decodable>(url: URL?, parameters: [String: Any]? = nil, headers: [String: String]? = nil) async throws -> T {
        try await request(.get, url: url, parameters: parameters, headers: headers)
    }
    
    func post<T: Decodable>(url: URL?, parameters: [String: Any]? = nil, headers: [String: String]? = nil) async throws -> T {
        try await request(.post, url: url, parameters: parameters, headers: headers)
    }
    
    func put<T: Decodable>(url: URL?, parameters: [String: Any]? = nil, headers: [String: String]? = nil) async throws -> T {
        try await request(.put, url: url, parameters: parameters, headers: headers)
    }
}
