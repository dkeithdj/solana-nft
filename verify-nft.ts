import {
  findMetadataPda,
  mplTokenMetadata,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";

import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";

import {
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { clusterApiUrl, Connection } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

console.log("Loaded user", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("Set up Umi instance for user");

const collectionAddress = publicKey(
  "F9SMgSvpEpaR3X4wkj58cjhWfPLVbjk5qGjVCpQcW3J4",
);

const nftAddress = publicKey("AAXPB5c8r4QPTT5bDdrtq63brTLWRDMHN7qsjrcX6qT2");

const transaction = verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, {
    mint: nftAddress,
  }),
  collectionMint: collectionAddress,
  authority: umi.identity,
});

transaction.sendAndConfirm(umi);

console.log(
  `✅ NFT ${nftAddress} verified as member of collection ${collectionAddress}! See explorer: ${getExplorerLink("address", nftAddress, "devnet")}`,
);
