import { bitcoin_network } from "azle/canisters/management/idl";
import { jsonStringify } from "azle/experimental";
import express, { Request } from "express";
import { kosan } from './const/kosan';
import { Kosan as iKosan }  from './interface/kosan';

// Dummy values instead of real Bitcoin interactions
const NETWORK: bitcoin_network = { testnet: null };
const DERIVATION_PATH: Uint8Array[] = [];
const KEY_NAME: string = "test_key_1";

const app = express();
app.use(express.json());

/// Dummy: Returns the balance of a given Bitcoin address.
app.get("/", async (req: Request, res) => {
    const response = {
      success: true,
      lastChecked: new Date().toISOString(),
    };
  res.json(response);
});




/// Dummy: Returns the balance of a given Bitcoin address.
app.post("/get-kosan", async (req: Request, res) => {
  const { name, priceRange, location, facility } = req.body;

  console.log("masukk " ,{ name, priceRange, location, facility })
  // Filter kosan list with includes logic
  const recomendationKosan = kosan.filter((k: iKosan) => {
    let match = false;

    if (name && k.name.toLowerCase().includes(name.toLowerCase())) {
      match = true;
    }
    if (priceRange && k.price <= priceRange +100000 && k.price >= priceRange-100000) {
      match = true;
    }

    if (location && k.location.toLowerCase().includes(location.toLowerCase())) {
      match = true;
    }
    if (facility && k.facility.toLowerCase().includes(facility.toLowerCase())){
      match = true;
    }

    return match;
  });

  console.log("darderdor. : ", recomendationKosan)
  res.status(200).json(recomendationKosan);
});

app.use(express.static("/dist"));

app.listen();

export function determineKeyName(network: bitcoin_network): string {
  return "test_key_1"; // always return dummy key
}

export function determineNetwork(
  networkName?: string,
): bitcoin_network | undefined {
  return { testnet: null }; // always return dummy network
}
