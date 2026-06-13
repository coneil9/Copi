// billing.js — plan math for mock Stripe integration

const FLAT_RATE_PRICE = 49;  // $/mo up to 10 seats
const FLAT_RATE_LIMIT = 10;
const PER_SEAT_PRICE  = 5;   // $/seat/mo above 10
const PER_LOC_PRICE   = 20;  // $/location/mo (post-MVP)

export function calcPlan(seats, locations = 1) {
  const baseSeats = Math.min(seats, FLAT_RATE_LIMIT);
  const extraSeats = Math.max(0, seats - FLAT_RATE_LIMIT);
  const seatsTotal = FLAT_RATE_PRICE + (extraSeats * PER_SEAT_PRICE);
  return {
    seats,
    locations,
    baseSeats,
    extraSeats,
    flatRate: FLAT_RATE_PRICE,
    perSeatCharge: extraSeats * PER_SEAT_PRICE,
    total: seatsTotal,
    perSeat: PER_SEAT_PRICE,
    flatLimit: FLAT_RATE_LIMIT,
    onFlatPlan: seats <= FLAT_RATE_LIMIT,
  };
}
