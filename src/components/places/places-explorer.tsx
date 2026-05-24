"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { PlaceCard } from "@/components/places/place-card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  filterGroupedPlaces,
  groupPlacesByStateAndCity,
  type PlaceForListing,
} from "@/lib/group-places";

type PlacesExplorerProps = {
  places: PlaceForListing[];
};

export function PlacesExplorer({ places }: PlacesExplorerProps) {
  const grouped = useMemo(() => groupPlacesByStateAndCity(places), [places]);

  const states = useMemo(
    () => grouped.map((g) => g.state).sort((a, b) => a.localeCompare(b)),
    [grouped]
  );

  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const citiesInState = useMemo(() => {
    if (!stateFilter) return [];
    const group = grouped.find((g) => g.state === stateFilter);
    return group?.cities.map((c) => c.city) ?? [];
  }, [grouped, stateFilter]);

  const displayed = useMemo(
    () => filterGroupedPlaces(grouped, stateFilter, cityFilter),
    [grouped, stateFilter, cityFilter]
  );

  const totalShown = displayed.reduce((sum, g) => sum + g.placeCount, 0);

  function handleStateChange(value: string) {
    setStateFilter(value);
    setCityFilter("");
  }

  if (places.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          No approved places yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="filter-state">State</Label>
          <Select
            id="filter-state"
            value={stateFilter}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="filter-city">City</Label>
          <Select
            id="filter-city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            disabled={!stateFilter}
          >
            <option value="">
              {stateFilter ? "All cities in state" : "Select a state first"}
            </option>
            {citiesInState.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </div>
        {(stateFilter || cityFilter) && (
          <button
            type="button"
            onClick={() => {
              setStateFilter("");
              setCityFilter("");
            }}
            className="text-sm font-medium text-primary hover:underline sm:mb-2"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {totalShown} {totalShown === 1 ? "place" : "places"}
        {stateFilter && ` in ${stateFilter}`}
        {cityFilter && ` · ${cityFilter}`}
      </p>

      {displayed.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No places match your filters. Try clearing them.
          </p>
        </div>
      ) : (
        <div className="space-y-14">
          {displayed.map((stateGroup) => (
            <section key={stateGroup.state} aria-labelledby={`state-${stateGroup.state}`}>
              <div className="mb-8 flex flex-wrap items-baseline gap-3 border-b pb-3">
                <h2
                  id={`state-${stateGroup.state}`}
                  className="text-2xl font-bold tracking-tight"
                >
                  {stateGroup.state}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {stateGroup.placeCount}{" "}
                  {stateGroup.placeCount === 1 ? "place" : "places"}
                </span>
              </div>

              <div className="space-y-10">
                {stateGroup.cities.map((cityGroup) => (
                  <div key={`${stateGroup.state}-${cityGroup.city}`}>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground/90">
                      <MapPin className="h-5 w-5 text-primary" />
                      {cityGroup.city}
                      <span className="text-sm font-normal text-muted-foreground">
                        ({cityGroup.places.length})
                      </span>
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {cityGroup.places.map((place) => (
                        <PlaceCard key={place.id} {...place} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
