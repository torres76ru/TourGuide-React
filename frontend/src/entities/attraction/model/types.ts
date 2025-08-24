import type { User } from 'entities/user/model/types';

export interface Attraction {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  address: string;
  main_photo_url: string | null;
  average_rating: number;
  rating_count: number;
}

export interface iReview {
  id: number;
  user: User;
  value: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface AttractionDetails extends Attraction {
  description: string;
  additional_photos: string[];
  phone_number: string;
  email: string;
  website: string;
  ratings: iReview[];
}

export type AttractionDetailsResponse = AttractionDetails;

export interface AttractionListResponse {
  city: string;
  attractions: Attraction[];
}

export type AttractionResponse = Attraction[];
