const assert = require('assert')
const { ethers } = require("hardhat");
const MultisigArtifact = require('../artifacts/contracts/Multisig.sol/Multisig.json')

let signer, friend, enemy, multisig;

beforeEach(async () => {
  [signer, friend, enemy] = await ethers.getSigners();

  const Multisig = await new ethers.ContractFactory(MultisigArtifact.abi, MultisigArtifact.bytecode, signer);
  multisig = await Multisig.deploy();
  await multisig.deployed()
});

describe("Multisig Setup", () => {
  it("should deploy", async () => {
    assert.ok(multisig.address);
  });

  it("should accept funds", async () => {
    await signer.sendTransaction({to: multisig.address, value: ethers.utils.parseEther("1")})
    const bal = await ethers.provider.getBalance(multisig.address);
    assert(ethers.utils.formatEther(bal) == 1);
  });

  it("should accept new signers", async () => {
    await multisig.addSigner(friend.address);
    const friendASigner = await multisig.isASigner(friend.address);
    assert(friendASigner == true);
    assert(await multisig.signerCount() == 2);
  })

  it("should remove signers", async () => {
    await multisig.addSigner(friend.address);
    await multisig.removeSigner(friend.address);
    const friendASigner = await multisig.isASigner(friend.address);
    assert(friendASigner == false);
    assert(await multisig.signerCount() == 1);
  })

  it("should update sigs needed", async () => {
    assert(await multisig.sigsNeeded() == 1)
    await multisig.addSigner(friend.address);
    await multisig.updateSignaturesNeeded(2);
    assert(await multisig.sigsNeeded() == 2)
  })
});

describe("Requests", () => {
  beforeEach(async () => {
    await multisig.addSigner(friend.address);
    await multisig.updateSignaturesNeeded(2);
    await multisig.addSigner(enemy.address);
    await signer.sendTransaction({to: multisig.address, value: ethers.utils.parseEther("10")})
  })

  it("should create a new request", async () => {
    await multisig.makeRequest(friend.address, ethers.utils.parseEther("1"));
    const req = await multisig.requests(0);
    console.log(req)
    assert.ok(req);
  })

  it("should allow vote on a request", async () => {
    await multisig.makeRequest(friend.address, ethers.utils.parseEther("1"));
    await multisig.connect(friend).vote(0);
    const votes = (await multisig.requests(0)).votes;
    assert(votes == 2);
  })

  it("shouldnt allow repeat vote", async () => {
    await multisig.makeRequest(friend.address, ethers.utils.parseEther("1"));
    await multisig.connect(friend).vote(0);
    try {
      await multisig.connect(friend).vote(0);
      assert(false)  
    } catch (err) {
      assert(err)
    }
  })

  it("should execute if sufficient votes", async () => {
    await multisig.makeRequest(friend.address, ethers.utils.parseEther("1"));
    await multisig.connect(friend).vote(0);
    const oldFriendBal = await ethers.provider.getBalance(friend.address);

    await multisig.execute(0);
    const bal = await ethers.provider.getBalance(multisig.address);
    const newFriendBal = await ethers.provider.getBalance(friend.address);

    assert(ethers.utils.formatEther(bal) == 9);
    assert(newFriendBal - oldFriendBal > 0);
  })

  it("shouldnt allow execute if not enough votes", async () => {
    await multisig.makeRequest(friend.address, ethers.utils.parseEther("1"));
    try {
      await multisig.execute(0);
      assert(false)  
    } catch (err) {
      assert(err)
    }
  })

  it("shouldnt allow execute if already paid out", async () => {
    await multisig.makeRequest(friend.address, ethers.utils.parseEther("1"));
    await multisig.connect(friend).vote(0);
    await multisig.execute(0);
    try {
      await multisig.execute(0);
      assert(false)
    } catch (err) {
      assert(err)
    }
  })
})
