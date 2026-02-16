"use server";

import { Client } from "dwolla-v2";

const getEnvValue = (): string => {
  return (
    process.env.DWOLLA_ENVIRONMENT?.trim() ||
    process.env.DWOLLA_ENV?.trim() ||
    ""
  );
};

const resolveEnvironment = (throwOnMissing = false): "production" | "sandbox" => {
  const env = getEnvValue();

  if (env === "production" || env === "sandbox") return env;
  if (process.env.NODE_ENV === "production" && throwOnMissing) {
    throw new Error(
      'Dwolla environment should either be set to `sandbox` or `production`'
    );
  }

  console.warn(
    `DWOLLA_ENVIRONMENT not set or invalid (got: "${env}"). Defaulting to "sandbox" for safety.`
  );
  return "sandbox";
};

let _client: Client | null = null;

function createClientInstance(throwOnMissing = false): Client {
  if (_client) return _client;

  const environment = resolveEnvironment(throwOnMissing);
  const key = process.env.DWOLLA_KEY || "";
  const secret = process.env.DWOLLA_SECRET || "";

  if ((!key || !secret) && process.env.NODE_ENV === "production" && throwOnMissing) {
    throw new Error("DWOLLA_KEY and DWOLLA_SECRET must be set in production");
  }

  _client = new Client({
    environment,
    key,
    secret,
  });

  return _client;
}

function getDwollaClient({ throwOnMissing = false } = {}): Client {
  return createClientInstance(throwOnMissing);
}

export const createFundingSource = async (options: CreateFundingSourceOptions) => {
  try {
    const client = getDwollaClient({ throwOnMissing: false });
    const res = await client.post(`customers/${options.customerId}/funding-sources`, {
      name: options.fundingSourceName,
      plaidToken: options.plaidToken,
    });
    return res.headers.get("location");
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
    throw err;
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const client = getDwollaClient({ throwOnMissing: false });
    const onDemandAuthorization = await client.post("on-demand-authorizations");
    return onDemandAuthorization.body._links;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", err);
    throw err;
  }
};

export const createDwollaCustomer = async (newCustomer: NewDwollaCustomerParams) => {
  try {
    const client = getDwollaClient({ throwOnMissing: false });
    const res = await client.post("customers", newCustomer);
    return res.headers.get("location");
  } catch (err) {
    console.error("Creating a Dwolla Customer Failed: ", err);
    throw err;
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const client = getDwollaClient({ throwOnMissing: false });
    const requestBody = {
      _links: {
        source: { href: sourceFundingSourceUrl },
        destination: { href: destinationFundingSourceUrl },
      },
      amount: { currency: "USD", value: amount },
    };
    const res = await client.post("transfers", requestBody);
    return res.headers.get("location");
  } catch (err) {
    console.error("Transfer fund failed: ", err);
    throw err;
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    const dwollaAuthLinks = await createOnDemandAuthorization();
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Adding funding source failed: ", err);
    throw err;
  }
};
