//
//  SwiftUIView.swift
//  x
//
//  Created by Hackathon on 6/2/2025.
//

import SwiftUI
import WebKit

struct YoutubeVideoPlayeView: UIViewRepresentable {
    let videoUrl: String

    func makeUIView(context: Context) -> WKWebView {
        return WKWebView()
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        guard let url = URL(string: videoUrl) else {
            return
        }
        let request = URLRequest(url: url)
        uiView.load(request)
    }
}

#Preview {
    YoutubeVideoPlayeView(videoUrl: "https://www.youtube.com/embed/0ytyMKa8aps")
}

