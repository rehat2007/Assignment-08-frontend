import { getAuth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

// Build the handlers lazily so `next build` never needs a live database
// connection or MONGODB_URI just to collect route configuration.
let handlers;

function getHandlers() {
  if (!handlers) handlers = toNextJsHandler(getAuth());
  return handlers;
}

export function GET(request) {
  return getHandlers().GET(request);
}

export function POST(request) {
  return getHandlers().POST(request);
}
