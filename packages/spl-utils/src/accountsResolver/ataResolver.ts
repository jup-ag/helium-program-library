import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { resolveIndividual } from "./individual";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { get } from "./utils";

export type AtaResolverArgs = {
  instruction?: string;
  account: string;
  mint: string;
  owner: string;
};

export function ataResolver<T extends anchor.Idl>({
  instruction,
  account,
  mint,
  owner,
}: AtaResolverArgs): anchor.CustomAccountResolver<T> {
  return resolveIndividual(async ({ path, accounts, idlIx }) => {
    if ((typeof instruction === "undefined" || idlIx.name === instruction) && path.join(".") === account) {
      const mintKey = get(accounts, mint.split(".")) as PublicKey;
      const ownerKey = get(accounts, owner.split(".")) as PublicKey;

      if (mintKey && ownerKey) {
        return getAssociatedTokenAddress(mintKey, ownerKey, true);
      }
    }
    return undefined;
  });
}
