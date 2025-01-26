export type PlantIdResponse = {
  name: string;
  probability: number;
  is_invasive: boolean;
  img_url: string;
  latitude: number;
  longitude: number;
  family: string;
};

export type ProcessedImage = {
  name: string;
  probability: number;
  isInvasiv: boolean;
  imgUrl: string;
  latitude: number;
  longitude: number;
  family?: string;
};

// New types for the matches view
export type PlantMatch = {
  score: number;
  species: {
    scientificName: string;
    family: {
      scientificName: string;
    };
  };
  images: Array<{
    url: {
      m: string;
    };
  }>;
};

export type PlantMatchesResponse = {
  status: 'identified' | 'unidentified' | 'error';
  message?: string;
  results?: PlantMatch[];
  latitude?: number;
  longitude?: number;
};

export type ValidatedMatchResponse = {
  status: 'success' | 'error';
  message?: string;
  name?: string;
  isInvasiv?: boolean;
  latitude?: number;
  longitude?: number;
  imgUrl?: string;
  family?: string;
};
