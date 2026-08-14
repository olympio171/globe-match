import React, { useEffect, useRef, useState } from 'react';

// BASE_URL, not a leading slash: on GitHub Pages the site lives under /<repo>/
// and absolute paths would 404.
const VIDEO_SRC = `${import.meta.env.BASE_URL}blackhole.mp4`;
const POSTER_SRC = `${import.meta.env.BASE_URL}blackhole-poster.jpg`;

/**
 * Layered cosmic backdrop built on a looping black hole clip.
 *
 * Stack, bottom to top: poster -> video -> colour grade -> drifting stars ->
 * film grain -> legibility plate -> vignette. The poster sits under the video
 * so there is never an empty frame, and it doubles as the fallback when the
 * video is skipped or fails to load.
 */
export const CosmicBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Whether the clip is worth downloading at all on this device.
  const [playVideo, setPlayVideo] = useState(false);
  // Drives the fade from poster to moving footage.
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as any)?.connection?.saveData === true;

    // Phones, metered connections and reduced-motion users get the still frame.
    if (!coarsePointer && !reducedMotion && !saveData) {
      setPlayVideo(true);
    }
  }, []);

  // No scroll parallax: the backdrop stays locked to the viewport. A shifting
  // background reads as a rendering glitch rather than as depth, and the sense
  // of depth already comes from the layer stack below.

  // Some browsers reject autoplay even when muted; fall back to the poster.
  useEffect(() => {
    if (!playVideo) return;
    videoRef.current?.play().catch(() => setVideoReady(false));
  }, [playVideo]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#020617]">
      {/* Footage plane — poster and video move together under the parallax */}
      <div className="absolute inset-0">
        <img
          src={POSTER_SRC}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {playVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={POSTER_SRC}
            aria-hidden="true"
            src={VIDEO_SRC}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
            style={{ opacity: videoReady ? 1 : 0 }}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] ease-out"
          />
        )}
      </div>

      {/* Colour grade — pulls the footage into the site palette */}
      <div className="absolute inset-0 cosmic-grade" />

      {/* Drifting star layers, GPU-composited, no JS */}
      <div className="starfield starfield-far" />
      <div className="starfield starfield-near" />

      {/* Film grain */}
      <div className="absolute inset-0 cosmic-grain" />

      {/* Legibility plate + vignette so copy survives the accretion disk */}
      <div className="absolute inset-0 cosmic-legibility" />
      <div className="absolute inset-0 bg-radial-vignette opacity-70" />
    </div>
  );
};
