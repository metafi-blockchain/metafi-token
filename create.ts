import {
  closeAccount,
  createInitializeMintInstruction,
  createInitializeMintCloseAuthorityInstruction,
  getMintLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeTransferFeeConfigInstruction,
  LENGTH_SIZE,
  TYPE_SIZE,
  createInitializeMetadataPointerInstruction,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createInitializeInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";

(async () => {
  const wallet = Keypair.fromSecretKey(
    Uint8Array.from([
      60, 31, 216, 134, 68, 78, 5, 54, 175, 135, 221, 227, 168, 70, 131, 114,
      133, 65, 139, 93, 195, 126, 28, 32, 17, 15, 252, 196, 1, 237, 44, 57, 8,
      134, 50, 123, 56, 199, 184, 99, 61, 162, 196, 68, 143, 51, 117, 64, 26,
      54, 84, 218, 154, 157, 209, 231, 34, 3, 251, 190, 216, 153, 90, 113,
    ])
  );

  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const extensions = [
    ExtensionType.MintCloseAuthority,
    ExtensionType.TransferFeeConfig,
    ExtensionType.MetadataPointer,
  ];
  const feeBasisPoints = 50;
  const maxFee = BigInt(5_000);
  const decimals = 6;
  const metadata: TokenMetadata = {
    mint: mint,
    name: "MTF-2022",
    symbol: "MTF-2022",
    uri: "https://metafi.sh/static/media/avatarMetafi.794dbc16134351cdd7a613832e661f00.svg",
    additionalMetadata: [["new-field", "new-value"]],
  };

  const mintLen = getMintLen(extensions);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen
  );

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mint,
      wallet.publicKey,
      mint,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintCloseAuthorityInstruction(
      mint,
      wallet.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeTransferFeeConfigInstruction(
      mint,
      wallet.publicKey,
      wallet.publicKey,
      feeBasisPoints,
      maxFee,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mint,
      decimals,
      wallet.publicKey,
      wallet.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mint,
      metadata: mint,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: wallet.publicKey,
      updateAuthority: wallet.publicKey,
    })
  );
  const tx = await sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet, mintKeypair],
    undefined
  );
  console.log("TX: ", tx);
})();
