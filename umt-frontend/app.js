let provider;
let signer;
let tokenContract;

const tokenAddress = "0xEa210Debe27Cf789dbD4d767E6F5716A2905DA54"; // Replace with your deployed contract address
const tokenABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint amount) returns (bool)"
];

const ethBalanceEl = document.getElementById("ethBalance");
const tokenBalanceEl = document.getElementById("tokenBalance");
const connectBtn = document.getElementById("connectWallet");
const sendBtn = document.getElementById("sendToken");

connectBtn.onclick = async () => {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();

        // Display ETH balance
        const ethBalance = await signer.getBalance();
        ethBalanceEl.innerText = ethers.formatEther(ethBalance);

        // Token contract instance
        tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

        // Display token balance
        const address = await signer.getAddress();
        const tokenBalance = await tokenContract.balanceOf(address);
        tokenBalanceEl.innerText = ethers.formatUnits(tokenBalance, 18);
    } else {
        alert("Please install MetaMask!");
    }
};

sendBtn.onclick = async () => {
    const recipient = document.getElementById("recipient").value;
    const amount = document.getElementById("amount").value;

    if (!recipient || !amount) {
        alert("Enter recipient and amount!");
        return;
    }

    const tx = await tokenContract.transfer(recipient, ethers.parseUnits(amount, 18));
    await tx.wait();
    alert("Transfer successful!");

    // Update balance
    const address = await signer.getAddress();
    const tokenBalance = await tokenContract.balanceOf(address);
    tokenBalanceEl.innerText = ethers.formatUnits(tokenBalance, 18);
};
