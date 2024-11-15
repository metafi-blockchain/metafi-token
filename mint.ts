import {
  TOKEN_2022_PROGRAM_ID,
  createAccount,
  mintTo,
} from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";

(async () => {
  const wallet = Keypair.fromSecretKey(
    Uint8Array.from([
      60, 31, 216, 134, 68, 78, 5, 54, 175, 135, 221, 227, 168, 70, 131, 114,
      133, 65, 139, 93, 195, 126, 28, 32, 17, 15, 252, 196, 1, 237, 44, 57, 8,
      134, 50, 123, 56, 199, 184, 99, 61, 162, 196, 68, 143, 51, 117, 64, 26,
      54, 84, 218, 154, 157, 209, 231, 34, 3, 251, 190, 216, 153, 90, 113,
    ])
  );

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const MTF_20220 = new PublicKey(
    "2nAQhqW6foNMefK8baSrWgujazZge7iT8KAKJbkgGvPk"
  );
  const sourceAccount = await createAccount(
    connection,
    wallet,
    MTF_20220,
    wallet.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  await mintTo(
    connection,
    wallet,
    MTF_20220,
    sourceAccount,
    wallet.publicKey,
    1000000000000,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
})();
