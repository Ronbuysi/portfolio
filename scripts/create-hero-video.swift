import AppKit
import AVFoundation
import CoreImage
import CoreVideo
import Foundation

guard CommandLine.arguments.count == 3 else {
    fputs("Usage: swift create-hero-video.swift input.jpg output.mp4\n", stderr)
    exit(1)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let fileManager = FileManager.default
try? fileManager.removeItem(at: outputURL)

guard let source = CIImage(contentsOf: inputURL) else {
    fputs("Unable to load source image\n", stderr)
    exit(1)
}

let width = 1920
let height = 1080
let fps: Int32 = 30
let duration = 10
let frameCount = Int(fps) * duration
let outputRect = CGRect(x: 0, y: 0, width: width, height: height)

let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true
let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 5_000_000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    ],
]

let writerInput = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
writerInput.expectsMediaDataInRealTime = false

let adapter = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: writerInput,
    sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height,
        kCVPixelBufferCGImageCompatibilityKey as String: true,
        kCVPixelBufferCGBitmapContextCompatibilityKey as String: true,
    ]
)

guard writer.canAdd(writerInput) else {
    fputs("Unable to add video input\n", stderr)
    exit(1)
}

writer.add(writerInput)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let context = CIContext(options: [.cacheIntermediates: false])
let baseScale = max(CGFloat(width) / source.extent.width, CGFloat(height) / source.extent.height)

for frame in 0..<frameCount {
    while !writerInput.isReadyForMoreMediaData {
        usleep(1_000)
    }

    autoreleasepool {
        guard let pool = adapter.pixelBufferPool else {
            fputs("Pixel buffer pool unavailable\n", stderr)
            return
        }

        var optionalBuffer: CVPixelBuffer?
        CVPixelBufferPoolCreatePixelBuffer(nil, pool, &optionalBuffer)
        guard let buffer = optionalBuffer else {
            fputs("Unable to allocate pixel buffer\n", stderr)
            return
        }

        let progress = CGFloat(frame) / CGFloat(frameCount - 1)
        let zoom = 1 + progress * 0.075
        var image = source.transformed(by: CGAffineTransform(scaleX: baseScale * zoom, y: baseScale * zoom))
        let x = (CGFloat(width) - image.extent.width) / 2 - image.extent.minX
        let y = (CGFloat(height) - image.extent.height) / 2 - image.extent.minY
        image = image.transformed(by: CGAffineTransform(translationX: x, y: y))
        image = image.applyingFilter("CIColorControls", parameters: [
            kCIInputBrightnessKey: -0.23,
            kCIInputContrastKey: 1.08,
            kCIInputSaturationKey: 0.74,
        ])

        let seconds = Double(frame) / Double(fps)
        let fadeIn = min(1.0, seconds / 0.9)
        let fadeOut = min(1.0, (Double(duration) - seconds) / 0.9)
        let opacity = CGFloat(min(fadeIn, fadeOut))
        let black = CIImage(color: CIColor(red: 0, green: 0, blue: 0, alpha: 1 - opacity)).cropped(to: outputRect)
        image = black.composited(over: image).cropped(to: outputRect)

        context.render(image, to: buffer, bounds: outputRect, colorSpace: CGColorSpaceCreateDeviceRGB())
        let time = CMTime(value: CMTimeValue(frame), timescale: fps)
        if !adapter.append(buffer, withPresentationTime: time) {
            fputs("Failed to append frame \(frame)\n", stderr)
        }
    }
}

writerInput.markAsFinished()
let semaphore = DispatchSemaphore(value: 0)
writer.finishWriting { semaphore.signal() }
semaphore.wait()

guard writer.status == .completed else {
    fputs("Video export failed: \(writer.error?.localizedDescription ?? "unknown error")\n", stderr)
    exit(1)
}

print("Created \(outputURL.path)")
