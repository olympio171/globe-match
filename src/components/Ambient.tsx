import React from 'react';
import type { Scene } from '../theme/mood';
import { Horizon } from './Horizon';

/** Fixed backdrop: two drifting pools of light, film grain and the horizon. */
export const Ambient: React.FC<{ scene: Scene }> = ({ scene }) => (
  <div className="ambient" aria-hidden="true">
    <div className="ambient-glow one" />
    <div className="ambient-glow two" />
    <Horizon scene={scene} />
    <div className="ambient-grain" />
  </div>
);
