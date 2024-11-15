import {
  TOKEN_2022_PROGRAM_ID,
  createAccount,
  transferCheckedWithFee,
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
  const to = new PublicKey("Ceubkc7W7cZuVQEi6ygQ3YvLzm9ssKcBJQppemdX86jh");

  const MTF_20220 = new PublicKey(
    "2nAQhqW6foNMefK8baSrWgujazZge7iT8KAKJbkgGvPk"
  );

  const sourceAccount = new PublicKey(
    "812aY5YsvqSJoJ7u7G1iDCF7kiBHTJes2uHHb75FZQ8G"
  );

  const destinationAccount = await createAccount(
    connection,
    wallet,
    MTF_20220,
    to,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  const feeBasisPoints = 50;
  const maxFee = BigInt(5_000);
  const decimals = 6;

  const transferAmount = BigInt(1_000_000);
  let fee = (transferAmount * BigInt(feeBasisPoints)) / BigInt(10_000);
  if (fee > maxFee) {
    fee = maxFee;
  }
  await transferCheckedWithFee(
    connection,
    wallet,
    sourceAccount,
    MTF_20220,
    destinationAccount,
    wallet,
    transferAmount,
    decimals,
    fee,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
})();
