const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers} = require('hardhat');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const signer = ethers.provider.getSigner(0);

    // you can get that signer's address via .getAddress()
    // this variable is NOT used for Contract 3, just here as an example
    const address = await signer.getAddress();

    return { game, signer };
  }

  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);

    // you'll need to update the `balances` mapping to win this stage
    // .connect(addr3).buy().{value=1}, .connect(addr2).buy().{value=3}, .connect(addr1).buy().{value=2},win(addr1,addr2,addr3)
    // to call a contract as a signer you can use contract.connect
    const [ addr1,addr2 ,addr3] = await ethers.getSigners();
    await game.connect(addr3).buy({value: ethers.utils.parseEther("1")});
    await game.connect(addr2).buy({value: ethers.utils.parseEther("3")});
    await game.connect(addr1).buy({value: ethers.utils.parseEther("2")});

    // TODO: win expects three arguments
    await game.win(await addr1.getAddress(),await addr2.getAddress(),await addr3.getAddress());

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
