"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type LocationSelectProps = {
  state: string;
  district: string;
  city: string;
  onStateChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onCityChange: (value: string) => void;
  disabled?: boolean;
};

export function LocationSelect({
  state,
  district,
  city,
  onStateChange,
  onDistrictChange,
  onCityChange,
  disabled,
}: LocationSelectProps) {
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then((data) => setStates(data.states ?? []));
  }, []);

  useEffect(() => {
    if (!state) {
      setDistricts([]);
      setCities([]);
      return;
    }
    fetch(`/api/locations?state=${encodeURIComponent(state)}`)
      .then((r) => r.json())
      .then((data) => setDistricts(data.districts ?? []));
    onDistrictChange("");
    onCityChange("");
  }, [state, onDistrictChange, onCityChange]);

  useEffect(() => {
    if (!state || !district) {
      setCities([]);
      return;
    }
    fetch(
      `/api/locations?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`
    )
      .then((r) => r.json())
      .then((data) => setCities(data.cities ?? []));
    onCityChange("");
  }, [state, district, onCityChange]);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Select
          id="state"
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          disabled={disabled}
          required
        >
          <option value="">Select state</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="district">District</Label>
        <Select
          id="district"
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
          disabled={disabled || !state}
          required
        >
          <option value="">Select district</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Select
          id="city"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={disabled || !district}
          required
        >
          <option value="">Select city</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
