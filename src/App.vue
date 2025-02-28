<template>
	<div>
		<div class="header">
			<div v-if="account" class="account-info">
				<span class="account">Connected: {{ account }}</span>
				<br />
				<span class="balance">Balance: {{ balance }} ETH</span>
			</div>
			<button class="connect-button" @click="toggleConnection">
				{{ account ? 'Disconnect' : 'Connect Wallet' }}
			</button>
		</div>
		<div class="card">
			<div class="card-body">
				<div class="dropdown">
					<button class="token-select" @click="toggleDropdown">
						{{ selectedToken ? selectedToken : 'Select Token ▼' }}
					</button>
					<ul v-if="dropdownOpen" class="dropdown-menu">
						<li
							v-for="(address, token) in tokens"
							:key="token"
							@click="selectToken(token, address)"
						>
							{{ token }}
						</li>
					</ul>
				</div>
				<div class="input-group">
					<label>Amount</label>
					<input
						v-model="amount"
						type="number"
						placeholder="Whole or Fractional (eg: 10 or 1.053)"
					/>
				</div>
				<div class="input-group">
					<label>Recipient</label>
					<input
						v-model="recipient"
						type="text"
						placeholder="Enigmatic Smile Address (eg: 5FkCSxhnJrfu9FvW4cfhJ)"
						disabled="true"
					/>
				</div>
				<button class="lift-button" @click="lift" :disabled="!account">
					Lift
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { ethers } from 'ethers';
import abi from './abi.js';

export default {
	name: 'LiftForm',
	data() {
		return {
			dropdownOpen: false,
			tokens: {
				VOW: '0xbfaffd8001493dfeb51c26748d2aff53c2984190',
				v$: '0x6e0e39d23563382e76107a2fa6bca119dec30134',
				vKr: '0xe18e92cc7bd5694d9369bfd8288cb24c1abc4439',
				TOKEN20: '0xea5da4fd16cc61ffc4235874d6ff05216e3e038e',
				ETH: '0x',
			},
			selectedToken: '',
			selectedTokenAddress: '',
			amount: '',
			recipient: '5FkCSxhnJrfu9FvW4cfhJE86Wzr2e7xkofEMYAF2xohd4Mab',
			account: '',
			balance: '0.00',
			contractAddress: '0xd31d4be8b01534b04062672e5d6cc932b0e948b7',
		};
	},
	methods: {
		async toggleConnection() {
			if (this.account) {
				this.account = '';
				this.balance = '0.00';
				return;
			}
			if (window.ethereum) {
				try {
					const accounts = await window.ethereum.request({
						method: 'eth_requestAccounts',
					});
					this.account = accounts[0];

					// Ensure the user is on Sepolia
					await this.ensureSepoliaNetwork();

					await this.fetchBalance();
				} catch (error) {
					console.error('Error connecting wallet:', error);
				}
			} else {
				alert('Please install MetaMask!');
			}
		},
		async ensureSepoliaNetwork() {
			try {
				const currentNetwork = await window.ethereum.request({
					method: 'net_version',
				});
				if (currentNetwork !== '11155111') {
					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [
							{
								chainId: '0xAA36A7',
								rpcUrls: [
									'https://virtual.sepolia.rpc.tenderly.co/4bed0f52-ee6f-4453-a34f-9def9998833a',
								],
							},
						], // Sepolia Chain ID in Hex (11155111)
					});
				}
			} catch (error) {
				// If Sepolia is not available, add it
				if (error.code === 4902) {
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{
									chainId: '0xAA36A7',
									chainName: 'Ethereum Sepolia',
									nativeCurrency: {
										name: 'Sepolia ETH',
										symbol: 'ETH',
										decimals: 18,
									},
									rpcUrls: [
										'https://rpc.sepolia.org',
										'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
									],
									blockExplorerUrls: [
										'https://sepolia.etherscan.io/',
									],
								},
							],
						});
					} catch (addError) {
						console.error(
							'Error adding Sepolia network:',
							addError
						);
					}
				} else {
					console.error('Error switching network:', error);
				}
			}
		},
		async fetchBalance() {
			try {
				const provider = new ethers.BrowserProvider(window.ethereum);
				const balance = await provider.getBalance(this.account);
				this.balance = ethers.formatEther(balance).slice(0, 6);
			} catch (error) {
				console.error('Error fetching balance:', error);
			}
		},
		toggleDropdown() {
			this.dropdownOpen = !this.dropdownOpen;
		},
		selectToken(token, address) {
			this.selectedToken = token;
			this.selectedTokenAddress = address;
			this.dropdownOpen = false;
		},
		async lift() {
			if (
				!this.selectedToken ||
				!this.amount ||
				!this.recipient ||
				!this.account
			) {
				alert(
					'Please connect your wallet, select a token, enter an amount, and provide a recipient address.'
				);
				return;
			}

			try {
				const provider = new ethers.BrowserProvider(window.ethereum);
				const signer = await provider.getSigner();
				const contract = new ethers.Contract(
					this.contractAddress,
					abi,
					signer
				);

				// Convert recipient to bytes format (this assumes the recipient is a valid T2 public key)
				const recipientBytes = ethers.toUtf8Bytes(this.recipient);

				// Convert amount to Wei or token units
				let parsedAmount;
				let tx;

				console.log('Lifting', this.amount, this.selectedToken);
				
				if (this.selectedToken === 'ETH') {
					// For ETH, convert to Wei
					parsedAmount = ethers.parseEther(this.amount.toString());

					// Show confirmation dialog
					if (
						!confirm(
							`Are you sure you want to lift ${this.amount} ETH to ${this.recipient}?`
						)
					) {
						return;
					}

					// Call liftETH function with value parameter
					tx = await contract.liftETH('0xa2d3849213bfc753986b21637a2d0cc39a0f895d47dc50cea1065fc25c0c2809', {
						value: parsedAmount,
					});
				} else {
					
					// For ERC20 tokens
					parsedAmount = ethers.parseUnits(this.amount.toString(), 18); // Assuming 18 decimals for all tokens

					console.log('Lifting', parsedAmount, 'tokens');
					
					// Show confirmation dialog
					if (
						!confirm(
							`Are you sure you want to lift ${this.amount} ${this.selectedToken} to ${this.recipient}?`
						)
					) {
						return;
					}

					// Check if approval is needed first
					const tokenContract = new ethers.Contract(
						this.selectedTokenAddress,
						[
							'function approve(address spender, uint256 amount) returns (bool)',
							'function allowance(address owner, address spender) view returns (uint256)',
						],
						signer
					);

					const allowance = await tokenContract.allowance(
						this.account,
						this.contractAddress
					);

					// If allowance is less than the amount, request approval
					if (allowance < parsedAmount) {
						try {
							const approveTx = await tokenContract.approve(
								this.contractAddress,
								parsedAmount
							);

							// Show approval pending message
							alert(
								`Please approve the token transfer in your wallet. Waiting for confirmation...`
							);

							// Wait for approval confirmation
							await approveTx.wait();
							alert(
								`Approval confirmed! Now proceeding with the lift...`
							);
						} catch (approvalError) {
							console.error('Approval error:', approvalError);
							alert(
								`Error during token approval: ${
									approvalError.message ||
									'Transaction rejected'
								}`
							);
							return;
						}
					}

					// Call lift function
					tx = await contract.lift(
						this.selectedTokenAddress,
						'0xa2d3849213bfc753986b21637a2d0cc39a0f895d47dc50cea1065fc25c0c2809',
						parsedAmount
					);
				}

				// Show pending message
				alert(`Transaction submitted! Waiting for confirmation...`);

				// Wait for transaction confirmation
				const receipt = await tx.wait();

				if (receipt.status === 1) {
					alert(
						`Success! Your ${this.amount} ${this.selectedToken} has been lifted to ${this.recipient}`
					);

					// Reset form
					this.amount = '';

					// Refresh balance
					await this.fetchBalance();
				} else {
					alert(
						'Transaction completed but may have failed. Please check your wallet for details.'
					);
				}
			} catch (error) {
				console.error('Lift transaction error:', error);

				// Handle specific error cases
				if (error.code === 'ACTION_REJECTED') {
					alert('Transaction was rejected by user.');
				} else if (error.code === 'INSUFFICIENT_FUNDS') {
					alert(`Insufficient funds to complete this transaction.`);
				} else if (error.data && error.data.message) {
					alert(`Transaction failed: ${error.data.message}`);
				} else {
					alert(
						`Error: ${error.message || 'Unknown error occurred'}`
					);
				}
			}
		},
	},
};
</script>

<style>
.header {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 400px;
	margin: 20px auto;
	margin-top: 50px;
	padding: 10px;
}

.account {
	font-size: 14px;
	font-weight: bold;
	color: #333;
	margin-right: 10px;
}

.connect-button {
	background: #6a5acd;
	color: #fff;
	border: none;
	padding: 8px 12px;
	border-radius: 5px;
	font-weight: bold;
	cursor: pointer;
	transition: background 0.3s;
}

.connect-button:hover {
	background: #5849b5;
}

.card {
	width: 400px;
	margin: 20px auto;
	padding: 20px;
	background: #fff;
	border-radius: 10px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
}

.dropdown {
	position: relative;
	margin-bottom: 15px;
}

.token-select {
	background: transparent;
	border: 2px solid #6a5acd;
	color: #6a5acd;
	padding: 8px 12px;
	border-radius: 5px;
	cursor: pointer;
	font-weight: bold;
}

.dropdown-menu {
	position: absolute;
	background: white;
	border: 1px solid #ccc;
	border-radius: 5px;
	list-style: none;
	padding: 0;
	margin: 5px 0;
	width: 100%;
	z-index: 100;
}

.dropdown-menu li {
	padding: 10px;
	cursor: pointer;
	color: #6a5acd;
	font-weight: bold;
}

.dropdown-menu li:hover {
	background: #f0f0f0;
}

.custom-token {
	border-top: 1px solid #ccc;
	padding-top: 10px;
}

.input-group {
	display: flex;
	flex-direction: column;
	margin-bottom: 15px;
}

.input-group label {
	font-size: 14px;
	font-weight: bold;
	margin-bottom: 5px;
}

.input-group input {
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	font-size: 14px;
	outline: none;
}

.lift-button {
	background: #000;
	color: #fff;
	border: none;
	padding: 10px;
	border-radius: 5px;
	font-weight: bold;
	cursor: pointer;
	transition: background 0.3s;
}

.lift-button:disabled {
	background: #888;
	cursor: not-allowed;
}

.lift-button:hover:not(:disabled) {
	background: #333;
}
</style>
