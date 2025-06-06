export const REWARD_TOKEN_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const SUBMISSION_MANAGER_ADDRESS =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

import rewardAbi from "@/abi/ReadifyRewardToken.json";
import managerAbi from "@/abi/ReadifySubmissionManager.json";

export const REWARD_TOKEN_ABI = rewardAbi.abi;
export const SUBMISSION_MANAGER_ABI = managerAbi.abi;
