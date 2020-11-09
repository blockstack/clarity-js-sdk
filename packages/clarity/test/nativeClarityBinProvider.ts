import { getDefaultBinaryFilePath } from "@blockstack/clarity-native-bin/src";
import { assert } from "chai";
import fs from "fs-extra";
import { NativeClarityBinProvider, Receipt } from "../src";
import { getTempFilePath } from "../src/utils/fsUtil";

const clarityBinPath = getDefaultBinaryFilePath();

describe("NativeClarityBinProvider", () => {
  it("create ephemeral", async () => {
    const provider = await NativeClarityBinProvider.createEphemeral(clarityBinPath);
    assert.isDefined(provider);
  });

  it("set initial allocations", async () => {
    const principal = "ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV";
    const amount = 1000;
    const tempDbPath = getTempFilePath("blockstack-local-{uniqueID}.db");
    const provider = await NativeClarityBinProvider.create(
      [{ principal, amount }],
      tempDbPath,
      clarityBinPath
    );

    const receipt = await getStxBalance(principal, provider);
    assert.equal(receipt.result, `u${amount.toString()}`);
  });
});

async function getStxBalance(
  principal: string,
  provider: NativeClarityBinProvider
): Promise<Receipt> {
  const tempContractPath = getTempFilePath("blockstack-contract-{uniqueID}.clar");
  fs.writeFileSync(tempContractPath, "true");

  await provider.launchContract(
    "ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV.empty",
    tempContractPath
  );

  return provider.eval(
    "ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV.empty",
    `(stx-get-balance '${principal})`,
    true,
    true
  );
}
