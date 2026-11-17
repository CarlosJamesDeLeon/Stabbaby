import earGalleryImg from '../assets/images/gallery_ear_1_1781422329444.jpg';
import noseGalleryImg from '../assets/images/gallery_nose_1_1781422345577.jpg';
import lipGalleryImg from '../assets/images/gallery_lip_1_1781422361690.jpg';
import eyebrowGalleryImg from '../assets/images/gallery_eyebrow_1_1781422407798.jpg';
import dermalGalleryImg from '../assets/images/gallery_dermal_1_1781422375986.jpg';
import navelGalleryImg from '../assets/images/gallery_navel_1_1781422393155.jpg';

import earServiceImg from '../assets/images/ear_piercing_1781422056069.jpg';
import noseServiceImg from '../assets/images/nose_piercing_1781422073171.jpg';
import lipServiceImg from '../assets/images/lip_piercing_1781422087803.jpg';
import eyebrowServiceImg from '../assets/images/eyebrow_piercing_1781422103873.jpg';
import navelServiceImg from '../assets/images/navel_piercing_1781422117891.jpg';
import dermalServiceImg from '../assets/images/dermal_piercing_1781422132567.jpg';

import studioInteriorImg from '../assets/images/studio_photo_1_1781422425686.jpg';

import { PiercingItem, ServiceItem, StudioHour } from '../types';

export const LOOKBOOK_ITEMS: PiercingItem[] = [
  {
    id: 'lookbook-ear',
    category: 'ear',
    title: 'Ear Styling',
    price: '₱300 – ₱500',
    description: 'Curated lobe, helix, tragus, and conch placements adorned with implant-grade ASTM F-136 titanium.',
    image: earGalleryImg,
    spanClass: 'span-2',
  },
  {
    id: 'lookbook-nose',
    category: 'nose',
    title: 'Nose & Septum',
    price: '₱350 – ₱550',
    description: 'Nostril studs and bold circular barbells placed perfectly to harmonize with your facial profile.',
    image: noseGalleryImg,
    spanClass: 'tall',
  },
  {
    id: 'lookbook-lip',
    category: 'lip',
    title: 'Lip & Monroe',
    price: '₱400 – ₱600',
    description: 'Precision oral piercings with smooth flat-back labrets ensuring comfort and clean healing.',
    image: lipGalleryImg,
  },
  {
    id: 'lookbook-eyebrow',
    category: 'eyebrow',
    title: 'Eyebrow Accent',
    price: '₱400 – ₱600',
    description: 'Sharp vertical and horizontal placements angled cleanly to highlight the brow bone.',
    image: eyebrowGalleryImg,
    spanClass: 'tall',
  },
  {
    id: 'lookbook-dermal',
    category: 'dermal',
    title: 'Dermal Anchor',
    price: '₱600 – ₱900',
    description: 'Microdermal implants embedded with brilliant Swarovski and titanium gems for a floating jewel look.',
    image: dermalGalleryImg,
  },
  {
    id: 'lookbook-body',
    category: 'body',
    title: 'Body & Navel',
    price: '₱500 – ₱800',
    description: 'Classic curved barbells and floating crystal accents tailored to your posture and movement.',
    image: navelGalleryImg,
    spanClass: 'span-2',
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'service-ear',
    name: 'Ear Piercing',
    description: 'Lobe, cartilage, tragus, and more with precision needles.',
    price: '₱300 – ₱500',
    image: earServiceImg,
  },
  {
    id: 'service-nose',
    name: 'Nose Piercing',
    description: 'Nostril and septum piercings for a subtle or bold look.',
    price: '₱350 – ₱500',
    image: noseServiceImg,
    shiftDown: true,
  },
  {
    id: 'service-lip',
    name: 'Lip / Monroe',
    description: 'Clean, safe oral piercings with premium implant jewelry.',
    price: '₱400 – ₱600',
    image: lipServiceImg,
  },
  {
    id: 'service-eyebrow',
    name: 'Eyebrow Piercing',
    description: 'Vertical and horizontal placements to complement your features.',
    price: '₱400 – ₱600',
    image: eyebrowServiceImg,
  },
  {
    id: 'service-body',
    name: 'Body / Navel',
    description: 'Navel, nipple, and other surface body adornments.',
    price: '₱500 – ₱800',
    image: navelServiceImg,
    shiftDown: true,
  },
  {
    id: 'service-dermal',
    name: 'Dermal Anchor',
    description: 'Microdermal implants for a floating gem effect anywhere.',
    price: '₱600 – ₱900',
    image: dermalServiceImg,
  },
];

export const STUDIO_HOURS: StudioHour[] = [
  { days: 'THU — FRI', time: '3PM — 7PM (Walk-ins)' },
  { days: 'DAILY', time: '12PM — 8PM (Appointments)' },
];

export const STUDIO_MEDIA = {
  studioInterior: studioInteriorImg,
  earDetail: earServiceImg,
  lipDetail: lipGalleryImg,
};

export const TIME_SLOTS = [
  '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'
];

export const PIERCING_OPTIONS = [
  { value: 'ear', label: 'Ear' },
  { value: 'nose', label: 'Nose' },
  { value: 'lip', label: 'Lip' },
  { value: 'eyebrow', label: 'Eyebrow' },
  { value: 'body', label: 'Body' },
  { value: 'dermal', label: 'Dermal' },
  { value: 'other', label: 'Other / Not sure' },
];
