import json

with open('data/reference/nepal_adm0.geojson', encoding='utf-8') as f:
    adm0 = json.load(f)

with open('data/reference/nepal_adm1.geojson', encoding='utf-8') as f:
    adm1 = json.load(f)

with open('data/reference/nepal_adm2.geojson', encoding='utf-8') as f:
    adm2 = json.load(f)

# Clean non-standard root properties
for d in [adm0, adm1, adm2]:
    d.pop('crs', None)
    d.pop('name', None)

prov_meta = {
    'Province 1': {
        'id': 'PROV-1',
        'name': 'Koshi Province',
        'nepaliName': 'कोशी प्रदेश',
        'code': 1,
        'capital': 'Biratnagar',
        'areaKm2': 25905,
        'populationEstimate': '4.9 Million',
        'riskStatus': 'MODERATE',
        'activeDisasterCount': 1,
        'description': 'Eastern Himalayan basin. Monitoring Arun & Tamor river tributaries.',
        'districts': ['Taplejung', 'Panchthar', 'Ilam', 'Jhapa', 'Morang', 'Sunsari', 'Dhankuta', 'Terhathum', 'Sankhuwasabha', 'Bhojpur', 'Solukhumbu', 'Okhaldhunga', 'Khotang', 'Udayapur']
    },
    'Province 2': {
        'id': 'PROV-2',
        'name': 'Madhesh Province',
        'nepaliName': 'मधेश प्रदेश',
        'code': 2,
        'capital': 'Janakpur',
        'areaKm2': 9661,
        'populationEstimate': '6.1 Million',
        'riskStatus': 'LOW',
        'activeDisasterCount': 0,
        'description': 'Southern Terai plains. Flat agricultural floodplains.',
        'districts': ['Saptari', 'Siraha', 'Dhanusha', 'Mahottari', 'Sarlahi', 'Rautahat', 'Bara', 'Parsa']
    },
    'Bagmati': {
        'id': 'PROV-3',
        'name': 'Bagmati Province',
        'nepaliName': 'बागमती प्रदेश',
        'code': 3,
        'capital': 'Hetauda',
        'areaKm2': 20300,
        'populationEstimate': '6.3 Million',
        'riskStatus': 'CRITICAL',
        'activeDisasterCount': 1,
        'description': 'Central Nepal Himalayan corridor: Bhote Koshi / Tatopani transboundary flood & debris risk zone in Sindhupalchok.',
        'districts': ['Sindhupalchok', 'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Rasuwa', 'Dhading', 'Nuwakot', 'Kavrepalanchok', 'Dolakha', 'Ramechhap', 'Sindhuli', 'Makwanpur', 'Chitwan']
    },
    'Gandaki': {
        'id': 'PROV-4',
        'name': 'Gandaki Province',
        'nepaliName': 'गण्डकी प्रदेश',
        'code': 4,
        'capital': 'Pokhara',
        'areaKm2': 21773,
        'populationEstimate': '2.5 Million',
        'riskStatus': 'MODERATE',
        'activeDisasterCount': 0,
        'description': 'Annapurna & Dhaulagiri mountain basins. Marsyangdi and Kali Gandaki river systems.',
        'districts': ['Gorkha', 'Manang', 'Mustang', 'Myagdi', 'Kaski', 'Lamjung', 'Tanahun', 'Nawalpur', 'Syangja', 'Parbat', 'Baglung']
    },
    'Lumbini': {
        'id': 'PROV-5',
        'name': 'Lumbini Province',
        'nepaliName': 'लुम्बिनी प्रदेश',
        'code': 5,
        'capital': 'Deukhuri',
        'areaKm2': 22288,
        'populationEstimate': '5.1 Million',
        'riskStatus': 'LOW',
        'activeDisasterCount': 0,
        'description': 'Mid-western Terai and Chure range. Rapti and Tinau river basins.',
        'districts': ['Rukum East', 'Rolpa', 'Pyuthan', 'Gulmi', 'Arghakhanchi', 'Palpa', 'Parasi', 'Rupandehi', 'Kapilvastu', 'Dang', 'Banke', 'Bardiya']
    },
    'Karnali': {
        'id': 'PROV-6',
        'name': 'Karnali Province',
        'nepaliName': 'कर्णाली प्रदेश',
        'code': 6,
        'capital': 'Birendranagar',
        'areaKm2': 27984,
        'populationEstimate': '1.7 Million',
        'riskStatus': 'MODERATE',
        'activeDisasterCount': 0,
        'description': 'Rugged Himalayan terrain. Upper Karnali and Bheri trans-Himalayan watersheds.',
        'districts': ['Dolpa', 'Mugu', 'Humla', 'Jumla', 'Kalikot', 'Dailekh', 'Jajarkot', 'Rukum West', 'Salyan', 'Surkhet']
    },
    'Sudurpaschim': {
        'id': 'PROV-7',
        'name': 'Sudurpashchim Province',
        'nepaliName': 'सुदूरपश्चिम प्रदेश',
        'code': 7,
        'capital': 'Godawari',
        'areaKm2': 19539,
        'populationEstimate': '2.7 Million',
        'riskStatus': 'LOW',
        'activeDisasterCount': 0,
        'description': 'Far-western Mahakali and Seti river basins.',
        'districts': ['Bajura', 'Bajhang', 'Darchula', 'Baitadi', 'Dadeldhura', 'Doti', 'Achham', 'Kailali', 'Kanchanpur']
    }
}

for f in adm1['features']:
    sname = f['properties']['shapeName']
    if sname in prov_meta:
        f['properties'] = prov_meta[sname]

# Clean ADM2 district properties
for f in adm2['features']:
    dname = f['properties']['shapeName']
    f['properties'] = {
        'district': dname,
        'shapeID': f['properties'].get('shapeID', '')
    }

# Generate TypeScript file for Provinces & National Boundary
provinces_ts = """import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

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
 * Verified Nepal 7 Province Administrative Boundaries (WGS 84)
 * Source: geoBoundaries Open Humanitarian Administrative Boundary Dataset (geoBoundaries-NPL-ADM1).
 * Survey Department of Nepal verified topology.
 */
export const nepalProvincesGeoJson: FeatureCollection<Polygon | MultiPolygon, ProvinceProperties> = """ + json.dumps(adm1, indent=2) + """;

/**
 * Verified Nepal National Boundary (WGS 84)
 * Source: geoBoundaries Open Dataset (geoBoundaries-NPL-ADM0)
 */
export const nepalNationalBoundaryGeoJson: FeatureCollection<Polygon | MultiPolygon> = """ + json.dumps(adm0, indent=2) + """;
"""

with open('frontend/src/data/nepalProvincesGeoJson.ts', 'w', encoding='utf-8') as out:
    out.write(provinces_ts)

# Generate TypeScript file for Districts
districts_ts = """import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

export interface DistrictProperties {
  district: string;
  shapeID: string;
}

/**
 * Verified Nepal 77 Districts Boundaries (WGS 84)
 * Source: geoBoundaries Open Administrative Boundary Dataset (geoBoundaries-NPL-ADM2).
 */
export const nepalDistrictsGeoJson: FeatureCollection<Polygon | MultiPolygon, DistrictProperties> = """ + json.dumps(adm2, indent=2) + """;
"""

with open('frontend/src/data/nepalDistrictsGeoJson.ts', 'w', encoding='utf-8') as out:
    out.write(districts_ts)

print('Generated clean nepalProvincesGeoJson.ts and nepalDistrictsGeoJson.ts!')
