import { useAccount } from "wagmi";

function AddTokenButton() {
  const { address } = useAccount();

  const addToken = async () => {
    const tokenAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
    const tokenSymbol = "DRT";
    const tokenDecimals = 18;
    const tokenImage = ""; // optional image URL

    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        alert("Token added!");
      } else {
        alert("User declined.");
      }
    } catch (error) {
      console.log(error);
      alert("Error adding token.");
    }
  };

  return (
    <button onClick={addToken} className="btn">
      Add DRT Token to MetaMask
    </button>
  );
}

export default AddTokenButton;
