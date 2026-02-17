export interface TemperatureScaleData {
  id: number;
  name: string;
  symbol: string;
  color: string;
  description: string;
  inventor: string;
  year: string;
  keyPoints: string[];
  formula: string;
  usage: string;
}

export interface CommonTemperature {
  name: string;
  celsius: number;
  description: string;
}

export interface Curiosity {
  icon: string;
  text: string;
}

export interface IntroText {
  title: string;
  description: string;
  points: string[];
}

export interface FinalNote {
  title: string;
  text: string;
}

export interface AppData {
  temperatureScales: TemperatureScaleData[];
  commonTemperatures: CommonTemperature[];
  curiosities: Curiosity[];
  introText: IntroText;
  finalNote: FinalNote;
}