import React from 'react';
import {
  Baby, Bath, BookOpen, Bug, Building2, CalendarDays, CalendarRange, Car, Caravan, Castle, Citrus,
  Clock, CloudSun, Coffee, Coins, Compass, Crown, Eye, EyeOff, Feather, Fish, Flame, Flower2,
  Footprints, Gem, Globe, Globe2, Grape, Hammer, Heart, Home, Hotel, Hourglass, Key, Landmark,
  Languages, Laptop, Leaf, Moon, Mountain, MountainSnow, Music, Palette, Palmtree, PartyPopper,
  PawPrint, Plane, PlaneTakeoff, Sailboat, Salad, Sandwich, Scale, Shell, ShieldCheck, ShoppingBag,
  Shuffle, Snail, Snowflake, Soup, Stamp, Sun, Sunset, Telescope, TentTree, TramFront, TreePine,
  Trees, Users, UtensilsCrossed, Wallet, Waves, Wifi, Wind, Wine, Zap,
  type LucideIcon,
} from 'lucide-react';

/** Only the icons the quiz references, so the bundle doesn’t carry all of lucide. */
const ICONS: Record<string, LucideIcon> = {
  Baby, Bath, BookOpen, Bug, Building2, CalendarDays, CalendarRange, Car, Caravan, Castle, Citrus,
  Clock, CloudSun, Coffee, Coins, Compass, Crown, Eye, EyeOff, Feather, Fish, Flame, Flower2,
  Footprints, Gem, Globe, Globe2, Grape, Hammer, Heart, Home, Hotel, Hourglass, Key, Landmark,
  Languages, Laptop, Leaf, Moon, Mountain, MountainSnow, Music, Palette, Palmtree, PartyPopper,
  PawPrint, Plane, PlaneTakeoff, Sailboat, Salad, Sandwich, Scale, Shell, ShieldCheck, ShoppingBag,
  Shuffle, Snail, Snowflake, Soup, Stamp, Sun, Sunset, Telescope, TentTree, TramFront, TreePine,
  Trees, Users, UtensilsCrossed, Wallet, Waves, Wifi, Wind, Wine, Zap,
};

export const Icon: React.FC<{ name?: string; className?: string }> = ({ name, className }) => {
  const Cmp = (name && ICONS[name]) || Compass;
  return <Cmp className={className} aria-hidden="true" strokeWidth={1.75} />;
};
