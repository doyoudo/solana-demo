import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Demo } from "../target/types/demo";
import { expect } from "chai";

describe("demo", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Demo as Program<Demo>;

  it("初始化计数器", async () => {
    const counter = anchor.web3.Keypair.generate();
    await program.methods
      .initialize()
      .accounts({
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counter])
      .rpc();

    const counterAccount = await program.account.counter.fetch(counter.publicKey);
    expect(counterAccount.count.toNumber()).to.equal(0);
  });

  it("增加计数器", async () => {
    const counter = anchor.web3.Keypair.generate();
    await program.methods
      .initialize()
      .accounts({
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counter])
      .rpc();

    await program.methods
      .increment()
      .accounts({
        counter: counter.publicKey,
      })
      .rpc();

    const counterAccount = await program.account.counter.fetch(counter.publicKey);
    expect(counterAccount.count.toNumber()).to.equal(1);
  });
});
