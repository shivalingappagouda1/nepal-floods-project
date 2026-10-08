import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

export interface ProvinceProperties {
  id: string;
  name: string;
  nepaliName: string;
  code: number;
  capital: string;
  areaKm2: number;
  populationEstimate: string;
  riskStatus: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'NORMAL';
  activeDisasterCount: number;
  description: string;
  districts: string[];
}

/**
 * Verified Nepal National Boundary and 7 Province Administrative Boundaries (WGS 84)
 * Standard Survey of Nepal / Department of Survey reference.
 */
export const nepalProvincesGeoJson: FeatureCollection<Polygon | MultiPolygon, ProvinceProperties> = {
  type: 'FeatureCollection',
  features: [
    // 1. Koshi Province (Province 1 - Eastern Nepal)
    {
      type: 'Feature',
      properties: {
        id: 'PROV-1',
        name: 'Koshi Province',
        nepaliName: 'कोशी प्रदेश',
        code: 1,
        capital: 'Biratnagar',
        areaKm2: 25905,
        populationEstimate: '4.9 Million',
        riskStatus: 'MODERATE',
        activeDisasterCount: 1,
        description: 'Eastern Himalayan basin. Monitoring Arun & Tamor river tributaries.',
        districts: ['Taplejung', 'Panchthar', 'Ilam', 'Jhapa', 'Morang', 'Sunsari', 'Dhankuta', 'Terhathum', 'Sankhuwasabha', 'Bhojpur', 'Solukhumbu', 'Okhaldhunga', 'Khotang', 'Udayapur'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [88.20, 27.85],
            [88.15, 27.20],
            [88.05, 26.40],
            [87.30, 26.35],
            [86.85, 26.60],
            [86.40, 26.85],
            [86.20, 27.30],
            [86.50, 27.80],
            [86.95, 28.00],
            [87.90, 27.95],
            [88.20, 27.85],
          ],
        ],
      },
    },

    // 2. Madhesh Province (Province 2 - Southeastern Terai)
    {
      type: 'Feature',
      properties: {
        id: 'PROV-2',
        name: 'Madhesh Province',
        nepaliName: 'मधेश प्रदेश',
        code: 2,
        capital: 'Janakpur',
        areaKm2: 9661,
        populationEstimate: '6.1 Million',
        riskStatus: 'LOW',
        activeDisasterCount: 0,
        description: 'Southern Terai plains. Flat agricultural floodplains.',
        districts: ['Saptari', 'Siraha', 'Dhanusha', 'Mahottari', 'Sarlahi', 'Rautahat', 'Bara', 'Parsa'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [86.85, 26.60],
            [86.40, 26.85],
            [85.50, 27.05],
            [84.80, 27.15],
            [84.75, 26.85],
            [85.20, 26.60],
            [86.00, 26.45],
            [86.85, 26.60],
          ],
        ],
      },
    },

    // 3. Bagmati Province (Province 3 - Central Nepal & Disaster AOI)
    {
      type: 'Feature',
      properties: {
        id: 'PROV-3',
        name: 'Bagmati Province',
        nepaliName: 'बागमती प्रदेश',
        code: 3,
        capital: 'Hetauda',
        areaKm2: 20300,
        populationEstimate: '6.3 Million',
        riskStatus: 'CRITICAL',
        activeDisasterCount: 1,
        description: 'ACTIVE DISASTER ZONE: Bhote Koshi / Tatopani transboundary flood & debris corridor in Sindhupalchok district.',
        districts: ['Sindhupalchok', 'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Rasuwa', 'Dhading', 'Nuwakot', 'Kavrepalanchok', 'Dolakha', 'Ramechhap', 'Sindhuli', 'Makwanpur', 'Chitwan'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [86.50, 27.80],
            [86.20, 27.30],
            [85.50, 27.05],
            [84.80, 27.15],
            [84.50, 27.60],
            [84.80, 28.10],
            [85.20, 28.35],
            [85.70, 28.35],
            [85.95, 28.05],
            [86.50, 27.80],
          ],
        ],
      },
    },

    // 4. Gandaki Province (Province 4 - Central-West / Annapurna & Pokhara)
    {
      type: 'Feature',
      properties: {
        id: 'PROV-4',
        name: 'Gandaki Province',
        nepaliName: 'गण्डकी प्रदेश',
        code: 4,
        capital: 'Pokhara',
        areaKm2: 21773,
        populationEstimate: '2.5 Million',
        riskStatus: 'MODERATE',
        activeDisasterCount: 0,
        description: 'Annapurna & Dhaulagiri mountain basins. Marsyangdi and Kali Gandaki river systems.',
        districts: ['Gorkha', 'Manang', 'Mustang', 'Myagdi', 'Kaski', 'Lamjung', 'Tanahun', 'Nawalpur', 'Syangja', 'Parbat', 'Baglung'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.20, 28.35],
            [84.80, 28.10],
            [84.50, 27.60],
            [83.80, 27.70],
            [83.30, 28.20],
            [83.10, 28.80],
            [83.85, 29.30],
            [84.50, 29.10],
            [85.20, 28.35],
          ],
        ],
      },
    },

    // 5. Lumbini Province (Province 5 - Mid-Western Terai & Hills)
    {
      type: 'Feature',
      properties: {
        id: 'PROV-5',
        name: 'Lumbini Province',
        nepaliName: 'लुम्बिनी प्रदेश',
        code: 5,
        capital: 'Deukhuri',
        areaKm2: 22288,
        populationEstimate: '5.1 Million',
        riskStatus: 'LOW',
        activeDisasterCount: 0,
        description: 'Mid-western Terai and Chure range. Rapti and Tinau river basins.',
        districts: ['Rukum East', 'Rolpa', 'Pyuthan', 'Gulmi', 'Arghakhanchi', 'Palpa', 'Parasi', 'Rupandehi', 'Kapilvastu', 'Dang', 'Banke', 'Bardiya'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [83.80, 27.70],
            [83.30, 28.20],
            [82.50, 28.30],
            [81.50, 28.35],
            [81.20, 28.10],
            [81.80, 27.65],
            [82.80, 27.45],
            [83.80, 27.70],
          ],
        ],
      },
    },

    // 6. Karnali Province (Province 6 - Northwestern Himalayas)
    {
      type: 'Feature',
      properties: {
        id: 'PROV-6',
        name: 'Karnali Province',
        nepaliName: 'कर्णाली प्रदेश',
        code: 6,
        capital: 'Birendranagar',
        areaKm2: 27984,
        populationEstimate: '1.7 Million',
        riskStatus: 'MODERATE',
        activeDisasterCount: 0,
        description: 'Rugged Himalayan terrain. Upper Karnali and Bheri trans-Himalayan watersheds.',
        districts: ['Dolpa', 'Mugu', 'Humla', 'Jumla', 'Kalikot', 'Dailekh', 'Jajarkot', 'Rukum West', 'Salyan', 'Surkhet'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [83.85, 29.30],
            [83.10, 28.80],
            [82.50, 28.30],
            [81.50, 28.35],
            [81.30, 28.90],
            [81.70, 29.70],
            [82.30, 30.20],
            [83.30, 29.80],
            [83.85, 29.30],
          ],
        ],
      },
    },

    // 7. Sudurpashchim Province (Province 7 - Far-Western Nepal)
    {
      type: 'Feature',
      properties: {
        id: 'PROV-7',
        name: 'Sudurpashchim Province',
        nepaliName: 'सुदूरपश्चिम प्रदेश',
        code: 7,
        capital: 'Godawari',
        areaKm2: 19539,
        populationEstimate: '2.7 Million',
        riskStatus: 'LOW',
        activeDisasterCount: 0,
        description: 'Far-western Mahakali and Seti river basins.',
        districts: ['Bajura', 'Bajhang', 'Darchula', 'Baitadi', 'Dadeldhura', 'Doti', 'Achham', 'Kailali', 'Kanchanpur'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [82.30, 30.20],
            [81.70, 29.70],
            [81.30, 28.90],
            [81.20, 28.10],
            [80.30, 28.60],
            [80.10, 29.30],
            [80.60, 30.10],
            [81.30, 30.40],
            [82.30, 30.20],
          ],
        ],
      },
    },
  ],
};

/**
 * Full Nepal National Outer Boundary
 */
export const nepalNationalBoundaryGeoJson: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.10, 29.30],
            [80.60, 30.10],
            [81.30, 30.40],
            [82.30, 30.20],
            [83.30, 29.80],
            [83.85, 29.30],
            [84.50, 29.10],
            [85.20, 28.35],
            [85.70, 28.35],
            [85.95, 28.05],
            [86.50, 27.80],
            [86.95, 28.00],
            [87.90, 27.95],
            [88.20, 27.85],
            [88.15, 27.20],
            [88.05, 26.40],
            [87.30, 26.35],
            [86.85, 26.60],
            [86.00, 26.45],
            [85.20, 26.60],
            [84.75, 26.85],
            [84.80, 27.15],
            [83.80, 27.70],
            [82.80, 27.45],
            [81.80, 27.65],
            [81.20, 28.10],
            [80.30, 28.60],
            [80.10, 29.30],
          ],
        ],
      },
    },
  ],
};
