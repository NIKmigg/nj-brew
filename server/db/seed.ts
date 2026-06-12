import { seedMeadConstants } from "@server/db/seeds/mead-constants";
import { seedProducts } from "@server/db/seeds/products";

async function main() {
  await seedProducts();
  await seedMeadConstants();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
