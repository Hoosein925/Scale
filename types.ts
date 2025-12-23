
export enum PatientCategory {
  ADULT = 'ADULT',
  PEDIATRIC = 'PEDIATRIC'
}

export enum PatientStatus {
  CONSCIOUS = 'HOSHIAR',
  DECREASED_CONSCIOUSNESS = 'KAHESH_HOSHIARI',
  PARALYZED = 'PARALYZED'
}

export enum PediatricAgeGroup {
  INFANT_TODDLER = '1MO_4YR', // FLACC
  PRE_SCHOOL = '3YR_7YR',   // Wong-Baker
  SCHOOL_ADOLESCENT = '7YR_18YR', // NRS
  POST_OP = 'POST_OP'        // CHIPPS
}

export enum PainSeverity {
  NONE = 'NONE',
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE'
}

export interface AssessmentResult {
  score: number;
  severity?: PainSeverity;
  interpretation?: string;
  recommendations?: string[];
  toolUsed: 'VAS' | 'BPS' | 'FLACC' | 'WONG_BAKER' | 'CHIPPS' | 'NRS' | 'VITAL_SIGNS' | 'Braden' | 'Morse' | 'HumptyDumpty' | 'GCS' | 'FOUR' | 'AVPU' | 'Wells' | 'SAD_PERSONS' | 'BMI' | 'RASS' | 'SOFA' | 'APACHE II' | 'PUSH' | 'NIHSS';
  timestamp: Date;
}

export interface BPSScores {
  facial: number;
  upperLimbs: number;
  ventilation: number;
  vocalization: number;
  isIntubated: boolean;
}

export interface FLACCScores {
  face: number;
  legs: number;
  activity: number;
  cry: number;
  consolability: number;
}

export interface BradenScores {
  sensory: number;
  moisture: number;
  activity: number;
  mobility: number;
  nutrition: number;
  friction: number;
}

export interface GCSScores {
  eyes: number;
  verbal: number;
  motor: number;
}

export interface HumptyDumptyScores {
  age: number;
  gender: number;
  diagnosis: number;
  cognitive: number;
  environmental: number;
  surgery: number;
  medication: number;
}

export interface FOURScores {
  eyes: number;
  motor: number;
  brainstem: number;
  respiration: number;
}