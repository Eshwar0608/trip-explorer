export type PlaceForListing = {
  id: string;
  name: string;
  city: string;
  state: string;
  district: string;
  famousFor: string;
  distanceFromBusStation: number;
  images: string[];
  reviews: { rating: number }[];
};

export type PlacesByCity = {
  city: string;
  places: PlaceForListing[];
};

export type PlacesByState = {
  state: string;
  cities: PlacesByCity[];
  placeCount: number;
};

export function groupPlacesByStateAndCity(
  places: PlaceForListing[]
): PlacesByState[] {
  const stateMap = new Map<string, Map<string, PlaceForListing[]>>();

  for (const place of places) {
    if (!stateMap.has(place.state)) {
      stateMap.set(place.state, new Map());
    }
    const cityMap = stateMap.get(place.state)!;
    if (!cityMap.has(place.city)) {
      cityMap.set(place.city, []);
    }
    cityMap.get(place.city)!.push(place);
  }

  const result: PlacesByState[] = [];

  for (const state of [...stateMap.keys()].sort((a, b) => a.localeCompare(b))) {
    const cityMap = stateMap.get(state)!;
    const cities: PlacesByCity[] = [];

    for (const city of [...cityMap.keys()].sort((a, b) => a.localeCompare(b))) {
      const cityPlaces = cityMap.get(city)!;
      cityPlaces.sort((a, b) => a.name.localeCompare(b.name));
      cities.push({ city, places: cityPlaces });
    }

    const placeCount = cities.reduce((sum, c) => sum + c.places.length, 0);
    result.push({ state, cities, placeCount });
  }

  return result;
}

export function filterGroupedPlaces(
  grouped: PlacesByState[],
  stateFilter: string,
  cityFilter: string
): PlacesByState[] {
  let filtered = grouped;

  if (stateFilter) {
    filtered = filtered.filter((g) => g.state === stateFilter);
  }

  if (cityFilter) {
    filtered = filtered
      .map((g) => ({
        ...g,
        cities: g.cities.filter((c) => c.city === cityFilter),
        placeCount: g.cities
          .filter((c) => c.city === cityFilter)
          .reduce((sum, c) => sum + c.places.length, 0),
      }))
      .filter((g) => g.cities.length > 0);
  }

  return filtered;
}
