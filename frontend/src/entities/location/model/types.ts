export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationState {
  coords: Coordinates | null;
  city: string | null;
  error: string | null;
}

export interface CityResponse {
  city: string;
}
