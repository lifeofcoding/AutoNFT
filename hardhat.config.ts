import "@nomicfoundation/hardhat-toolbox";
import type { HardhatUserConfig } from "hardhat/config";

const Config: HardhatUserConfig = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/artifacts",
  },
};
export default Config;