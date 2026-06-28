import type { Address } from "@shared/schemas/address";
import { text } from "drizzle-orm/sqlite-core";

export function addressColumn(name: string) {
  return text(name, { mode: "json" }).$type<Address>();
}
