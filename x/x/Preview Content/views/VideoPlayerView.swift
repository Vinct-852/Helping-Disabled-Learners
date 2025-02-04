//
//  VideoPlayer.swift
//  x
//
//  Created by Hackathon on 1/2/2025.
//

import SwiftUI
import AVFoundation
import AVKit

struct VideoPlayerView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> AVPlayerViewController {
        
        let controller = AVPlayerViewController()
        controller.player = AVPlayer()
        
        // Replace with a valid URL string pointing to a media resource
        if let url = URL.init(string: "https://res.cloudinary.com/nowo-ltd/video/upload/v1738410853/visionpropro/sample_video_tcsfue.mp4") {
            let playerItem = AVPlayerItem.init(url: url)
            controller.player?.replaceCurrentItem(with: playerItem)
        }
        
        return controller
    }
    
    func updateUIViewController( _: AVPlayerViewController, context: Context) {
        
    }
}

#Preview {
    VideoPlayerView()
}
