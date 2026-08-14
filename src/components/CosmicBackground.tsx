import React, { useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/blackhole.mp4';
const POSTER_SRC = '/blackhole-poster.jpg';

/**
 * Layered cosmic backdrop built on a looping black hole clip.
 *
 * Stack, bottom to top: poster -> video -> colour grade -> drifting stars ->
 * film grain -> legibility plate -> vignette. The poster sits under the video
 * so there is never an empty frame, and it doubles as the fallback when the
 * video is skipped or fails to load.
 */
export const CosmicBackground: React.FC = () => {
  const plateRef = useRef<HTMLDivElement | null>(null);
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

  // Scroll parallax. The transform is written straight to the node inside a
  // rAF — deliberately never through React state, which would re-render the
  // whole background on every scroll event.
  useEffect(() => {
    const plate = plateRef.current;
    if (!plate) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const apply = () => {
      frame = 0;
      const offset = Math.min(window.scrollY, 1600);
      plate.style.transform = `translate3d(0, ${offset * 0.16}px, 0) scale(${1 + offset * 0.00007})`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    apply();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Some browsers reject autoplay even when muted; fall back to the poster.
  useEffect(() => {
    if (!playVideo) return;
    videoRef.current?.play().catch(() => setVideoReady(false));
  }, [playVideo]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#020617]">
      {/* Footage plane — poster and video move together under the parallax */}
      <div ref={plateRef} className="absolute inset-0 will-change-transform">
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
