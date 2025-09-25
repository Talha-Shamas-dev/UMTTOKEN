let provider;
let signer;
let tokenContract;

const tokenAddress = "0xdA9b00A9A20C40846638AB577a7B300C04fea4C1";
const tokenABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)"
];

const ethBalanceEl = document.getElementById("ethBalance");
const tokenBalanceEl = document.getElementById("tokenBalance");
const connectBtn = document.getElementById("connectWallet");
const sendBtn = document.getElementById("sendToken");

// Connect MetaMask
connectBtn.onclick = async () => {
    try {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();

        const address = await signer.getAddress();
        console.log("Connected wallet:", address);

        // ✅ Network check: convert BigInt → Number
        const network = await provider.getNetwork();
        console.log("Connected network:", network);

        const chainId = Number(network.chainId); // fix here
        if (chainId !== 1337 && chainId !== 5777) {
            alert("⚠ Wrong network! Please switch MetaMask to Ganache (http://127.0.0.1:8545)");
            return;
        }

        // ✅ ETH balance (ethers v6)
        const ethBalance = await provider.getBalance(address);
        ethBalanceEl.innerText = ethers.formatEther(ethBalance);

        // ✅ Token contract instance
        tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

        // ✅ Token details + balance
        const decimals = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();
        const tokenBalance = await tokenContract.balanceOf(address);
        tokenBalanceEl.innerText = `${ethers.formatUnits(tokenBalance, decimals)} ${symbol}`;

        alert("✅ Wallet connected successfully!");
    } catch (err) {
        console.error("Connection error:", err);
        alert("Failed to connect MetaMask. Check console.");
    }
};

// Send Token
sendBtn.onclick = async () => {
    try {
        const recipient = document.getElementById("recipient").value;
        const amount = document.getElementById("amount").value;

        if (!recipient || !amount) {
            alert("Enter recipient and amount!");
            return;
        }

        const decimals = await tokenContract.decimals();
        const tx = await tokenContract.transfer(recipient, ethers.parseUnits(amount, decimals));
        alert("⏳ Transaction submitted: " + tx.hash);

        await tx.wait();
        alert("✅ Transaction confirmed!");

        // ✅ Update token balance after transfer
        const address = await signer.getAddress();
        const newBalance = await tokenContract.balanceOf(address);
        tokenBalanceEl.innerText = `${ethers.formatUnits(newBalance, decimals)} ${await tokenContract.symbol()}`;
    } catch (err) {
        console.error("Transaction error:", err);
        alert("❌ Transaction failed! Check console.");
    }
};
