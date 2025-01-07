const Transactions = artifacts.require("Transactions");

module.exports = async function (deployer) {
  await deployer.deploy(Transactions);
};
