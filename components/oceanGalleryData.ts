
import { IconName } from './OceanGallery';

export interface OceanStat {
  icon: IconName;
  label: string;
  value: string;
}

export interface OceanData {
  id: number;
  location: string;
  description: string;
  stats: OceanStat[];
}

export const oceanGalleryData: OceanData[] = [
  {
    id: 1,
    location: 'Pacific Ocean',
    description: "The largest and deepest of Earth's oceans, covering about a third of the planet's surface. It hosts the Mariana Trench and the vibrant Ring of Fire.",
    stats: [
        { icon: 'globe', label: 'Area', value: '165.2M km²' },
        { icon: 'mapPin', label: 'Avg. Depth', value: '4,280 m' },
        { icon: 'trendingUp', label: 'Key Feature', value: 'Vast & Deep' },
    ]
  },
  {
    id: 2,
    location: 'Atlantic Ocean',
    description: 'The second-largest ocean, separating the "Old World" from the "New World". It features a long, S-shaped basin and the Mid-Atlantic Ridge.',
    stats: [
        { icon: 'globe', label: 'Area', value: '106.4M km²' },
        { icon: 'mapPin', label: 'Avg. Depth', value: '3,646 m' },
        { icon: 'salinity', label: 'Key Feature', value: 'Salty & Young' },
    ]
  },
  {
    id: 3,
    location: 'Indian Ocean',
    description: 'The third-largest ocean, bounded by Asia, Africa, and Australia. It is the warmest ocean in the world and drives powerful monsoon seasons.',
    stats: [
        { icon: 'globe', label: 'Area', value: '73.5M km²' },
        { icon: 'mapPin', label: 'Avg. Depth', value: '3,741 m' },
        { icon: 'temperature', label: 'Key Feature', value: 'Warmest Ocean' },
    ]
  },
  {
    id: 4,
    location: 'Southern Ocean',
    description: 'The "Antarctic Ocean" encircles Antarctica. It is characterized by the powerful Antarctic Circumpolar Current, which connects the other major oceans.',
     stats: [
        { icon: 'globe', label: 'Area', value: '20.3M km²' },
        { icon: 'mapPin', label: 'Avg. Depth', value: '3,270 m' },
        { icon: 'trendingUp', label: 'Key Feature', value: 'Circumpolar Current' },
    ]
  },
  {
    id: 5,
    location: 'Arctic Ocean',
    description: 'The smallest, shallowest, and coldest major ocean. Its most defining feature is its extensive sea ice cover, which is rapidly changing.',
     stats: [
        { icon: 'globe', label: 'Area', value: '14.1M km²' },
        { icon: 'mapPin', label: 'Avg. Depth', value: '1,205 m' },
        { icon: 'temperature', label: 'Key Feature', value: 'Sea Ice Cover' },
    ]
  }
];
