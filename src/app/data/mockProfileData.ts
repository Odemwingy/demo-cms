// Type Definitions for Relational Profile Schema

export interface SupportedIfe {
  id: string;
  value: string;
  mpuTarget: string;
  mediaTarget: string;
  broadcastTarget: string;
  imgTarget: string;
}

export interface AircraftInfo {
  mfg: string;
  model: string;
  desc: string;
  tailNum: string; // Comma separated list for now
}

export interface ShipmentInfo {
  dependencyMediaMetadata: string;
  aircraftInfo: AircraftInfo;
  supportedIfes: SupportedIfe[];
}

export interface Profile {
  id: string;
  name: string;
  type: string;
  programNumber: string;
  disabled: boolean;
  linkedProfileId: string | null;
  version: string; // Schema Version
  shipmentInfo: ShipmentInfo;
  categorySetId: string | null; // e.g. linked to a specific Category Set
}

export interface CategorySet {
  id: string;
  name: string;
}

export interface MediaConfig {
  id: string;
  profileId: string;
  configId: string; // Numeric ID used in routes (e.g. "0")
  name: string;
  hidden: boolean;
}

export interface Route {
  id: string;
  profileId: string;
  mediaConfigId: string; // Links to MediaConfig.id
  name: string;
  origin: string;
  dest: string;
  flightNum: string;
  info: string;
  scriptId: string;
  paLangId: string;
  soundId: string;
  serviceId: string;
}

export interface ClassConfig {
  id: string;
  profileId: string;
  mediaConfigId: string | 'ALL'; // Links to MediaConfig.id or 'ALL'
  mmaDisplayName: string;
  exportedClasses: string[];
}

// ----------------------------------------------------
// Mock Data (HU Hainan Airlines eX3 Blueprint)
// ----------------------------------------------------

export const MOCK_CATEGORY_SETS: CategorySet[] = [
  { id: 'cs1', name: 'HU Default Category Set' }
];

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'p1',
    name: 'HU eX3',
    type: 'AVOD 1.5',
    programNumber: 'HU-01',
    disabled: false,
    linkedProfileId: null,
    version: 'v1.5.4',
    categorySetId: 'cs1',
    shipmentInfo: {
      dependencyMediaMetadata: 'HU_EX3_ALST_v2',
      aircraftInfo: {
        mfg: 'Boeing',
        model: '787-9',
        desc: 'Dreamliner',
        tailNum: 'B-1111, B-2222, B-2722, B-2723, B-2728',
      },
      supportedIfes: [
        { id: 'ife1', value: 'EX3', mpuTarget: 'MPU_MAIN', mediaTarget: 'MEDIA_SRV', broadcastTarget: 'BRD_SRV', imgTarget: 'IMG_SRV' }
      ]
    }
  },
  {
    id: 'p2',
    name: 'HU eX2',
    type: 'AVOD 1.4',
    programNumber: 'HU-01',
    disabled: false,
    linkedProfileId: 'p1',
    version: 'v1.5.4',
    categorySetId: 'cs1',
    shipmentInfo: {
      dependencyMediaMetadata: 'HU_EX2_LEGACY',
      aircraftInfo: {
        mfg: 'Airbus',
        model: 'A330',
        desc: '',
        tailNum: 'B-5971, B-5972',
      },
      supportedIfes: []
    }
  }
];

export const MOCK_MEDIA_CONFIGS: MediaConfig[] = [
  { id: 'mc1_p1', profileId: 'p1', configId: '0', name: 'Default', hidden: false },
  { id: 'mc2_p1', profileId: 'p1', configId: '1', name: 'Domestic', hidden: false },
  { id: 'mc3_p1', profileId: 'p1', configId: '2', name: 'International', hidden: false },
  { id: 'mc1_p2', profileId: 'p2', configId: '0', name: 'Default', hidden: false }
];

export const MOCK_ROUTES: Route[] = [
  { id: 'r1', profileId: 'p1', mediaConfigId: 'mc3_p1', name: 'Beijing-Paris', origin: 'PEK', dest: 'CDG', flightNum: 'HU793', info: 'Route:Intl', scriptId: '0', paLangId: '10', soundId: '0', serviceId: '1' },
  { id: 'r2', profileId: 'p1', mediaConfigId: 'mc3_p1', name: 'Paris-Beijing', origin: 'CDG', dest: 'PEK', flightNum: 'HU794', info: 'Route:Intl', scriptId: '0', paLangId: '10', soundId: '0', serviceId: '1' },
  { id: 'r3', profileId: 'p1', mediaConfigId: 'mc2_p1', name: 'Beijing-Sanya', origin: 'PEK', dest: 'SYX', flightNum: 'HU7381', info: 'Route:Domestic', scriptId: '1', paLangId: '0', soundId: '0', serviceId: '0' },
  { id: 'r4', profileId: 'p2', mediaConfigId: 'mc1_p2', name: 'Haikou-Guangzhou', origin: 'HAK', dest: 'CAN', flightNum: 'HU7001', info: '', scriptId: '0', paLangId: '0', soundId: '0', serviceId: '0' },
];

export const MOCK_CLASSES: ClassConfig[] = [
  { id: 'c1', profileId: 'p1', mediaConfigId: 'ALL', mmaDisplayName: 'Business', exportedClasses: ['Business'] },
  { id: 'c2', profileId: 'p1', mediaConfigId: 'ALL', mmaDisplayName: 'Economy', exportedClasses: ['Economy'] },
  { id: 'c3', profileId: 'p1', mediaConfigId: 'mc2_p1', mmaDisplayName: 'PremiumEconomy', exportedClasses: ['PremiumEconomy'] }, // Domestic specific class
  { id: 'c4', profileId: 'p2', mediaConfigId: 'ALL', mmaDisplayName: 'Economy', exportedClasses: ['Economy'] }
];
