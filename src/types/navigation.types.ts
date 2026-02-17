import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootTabParamList = {
  Home: undefined;
  Convertion: undefined;
  Explanation: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootTabParamList,
  'Home'
>;
export type ConvertionScreenNavigationProp = NativeStackNavigationProp<
  RootTabParamList,
  'Convertion'
>;

export type ExplanationScreenNavigationProp = NativeStackNavigationProp<
  RootTabParamList,
  'Explanation'
>;

export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export interface ConvertionScreenProps {
  navigation: ConvertionScreenNavigationProp;
}

export interface ExplanationScreenProps {
  navigation: ExplanationScreenNavigationProp;
}

// Tipos para los componentes de tabs
export interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

export interface TabBarLabelProps {
  focused: boolean;
  color: string;
  position: 'beside-icon' | 'below-icon';
  children: string;
}
