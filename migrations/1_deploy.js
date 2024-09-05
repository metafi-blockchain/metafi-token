const EKL = artifacts.require("EKL");

module.exports = function (deployer) {
  deployer.then(async () => {
    try {
      console.log("Deploy EKL");
      await deployer.deploy(EKL, "EKL", "EKL");

      console.log("Deploy USDC");
      await deployer.deploy(EKL, "USDC", "USDC");
    } catch (error) {
      console.log(error);
    }
  });
};
