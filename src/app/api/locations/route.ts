import { NextResponse } from "next/server";
import { getStates, getDistricts, getCities } from "@/lib/locations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state");
  const district = searchParams.get("district");

  if (state && district) {
    return NextResponse.json({ cities: getCities(state, district) });
  }

  if (state) {
    return NextResponse.json({ districts: getDistricts(state) });
  }

  return NextResponse.json({ states: getStates() });
}
