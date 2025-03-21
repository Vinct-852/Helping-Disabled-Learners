//
//  Video360Player.swift
//  x
//
//  Created by Hackathon on 8/2/2025.
//

import SwiftUI
import AVFoundation
import AVKit

import RealityKit

struct Video360EntityTestRV: View {
    @ObservedObject var immersiveManager = ImmersiveManager.shared

    var body: some View {
        RealityView() { content in
            // Create Entity for the video
            let videoEntity = Entity()

            // Observe changes to the URL
            if let urlString = immersiveManager.url, let url = URL(string: urlString) {
                // Create a simple AVPlayer
                let asset = AVURLAsset(url: url)
                let playerItem = AVPlayerItem(asset: asset)
                let player = AVPlayer()

                // Create a videoMaterial
                let material = VideoMaterial(avPlayer: player)

                // Make a Sphere with the videoEntity and assign the videoMaterial to it
                videoEntity.components.set(ModelComponent(mesh: .generateSphere(radius: 1E3), materials: [material]))

                // Adjust the properties of the videoEntity (Sphere) if needed
                videoEntity.scale = .init(x: 1, y: 1, z: -1)
                videoEntity.transform.translation += SIMD3<Float>(0.0, 10.0, 0.0)

                let angle = Angle.degrees(90)
                let rotation = simd_quatf(angle: Float(angle.radians), axis: .init(x: 0, y: 0, z: 0))

                videoEntity.transform.rotation = rotation

                // Add VideoEntity to realityView
                content.add(videoEntity)

                // Start the VideoPlayer
                player.replaceCurrentItem(with: playerItem)
                player.play()
            }
        }
    }
}
