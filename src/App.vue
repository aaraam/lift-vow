<template>
	<div class="app-container">
		<div class="header">
			<div class="logo">
				<div class="logo-icon">
					<svg
						viewBox="0 0 34 34"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M17 2L2 17L17 32L32 17L17 2Z"
							stroke="url(#gold-gradient)"
							stroke-width="2"
						/>
						<path
							d="M17 8L8 17L17 26L26 17L17 8Z"
							fill="url(#gold-gradient)"
							fill-opacity="0.4"
						/>
						<defs>
							<linearGradient
								id="gold-gradient"
								x1="2"
								y1="2"
								x2="32"
								y2="32"
								gradientUnits="userSpaceOnUse"
							>
								<stop offset="0%" stop-color="#FFD700" />
								<stop offset="100%" stop-color="#B8860B" />
							</linearGradient>
						</defs>
					</svg>
				</div>
				<span class="logo-text"
					>VOW<span class="logo-accent">Lift</span></span
				>
			</div>
			<div class="connection-area">
				<div v-if="account" class="account-info">
					<div class="account-badge">
						<span class="dot"></span>
						<span class="account-text"
							>{{ account.substring(0, 6) }}...{{
								account.substring(account.length - 4)
							}}</span
						>
					</div>
					<div class="balance-display">{{ balance }} ETH</div>
				</div>
				<button
					class="connect-button"
					@click="toggleConnection"
					:class="{ connected: account }"
				>
					<span class="button-icon">{{ account ? '✓' : '↗' }}</span>
					<span>{{ account ? 'Disconnect' : 'Connect Wallet' }}</span>
				</button>
				<button class="wallet-connect-button" @click="">
					<svg
						width="20"
						height="20"
						viewBox="0 0 96 96"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="wc-icon"
					>
						<path
							d="M25.3833 34.9147C42.0213 18.9547 68.9787 18.9547 85.6167 34.9147L87.5653 36.7653C88.452 37.608 88.452 39.0013 87.5653 39.844L80.152 46.9147C79.708 47.3373 79.0013 47.3373 78.5587 46.9147L75.7507 44.2507C64.34 33.3587 46.66 33.3587 35.2493 44.2507L32.2573 47.0587C31.8133 47.4813 31.108 47.4813 30.664 47.0587L23.252 39.988C22.364 39.1453 22.364 37.752 23.252 36.9093L25.3833 34.9147ZM94.1093 42.968L100.652 49.1853C101.54 50.028 101.54 51.4213 100.652 52.264L73.5187 78.0907C72.632 78.9333 71.1827 78.9333 70.296 78.0907C70.296 78.0907 70.296 78.0907 70.296 78.0907L51.8067 60.5293C51.584 60.3187 51.2387 60.3187 51.0173 60.5293C51.0173 60.5293 51.0173 60.5293 51.0173 60.5293L32.528 78.0907C31.6413 78.9333 30.192 78.9333 29.3053 78.0907C29.3053 78.0907 29.3053 78.0907 29.3053 78.0907L2.348 52.264C1.46133 51.4213 1.46133 50.028 2.348 49.1853L8.89067 42.968C9.77733 42.1253 11.2267 42.1253 12.1133 42.968L30.6027 60.5293C30.8253 60.74 31.1707 60.74 31.392 60.5293C31.392 60.5293 31.392 60.5293 31.392 60.5293L49.8813 42.968C50.768 42.1253 52.2173 42.1253 53.104 42.968C53.104 42.968 53.104 42.968 53.104 42.968L71.5933 60.5293C71.816 60.74 72.1613 60.74 72.3827 60.5293L90.872 42.968C91.7587 42.1253 93.208 42.1253 94.0947 42.968L94.1093 42.968Z"
							fill="currentColor"
						/>
					</svg>
					<span>WalletConnect</span>
				</button>
			</div>
		</div>

		<div class="card">
			<h2 class="card-title">Lift Assets to Cross-Chain</h2>
			<div class="card-body">
				<div class="dropdown">
					<button
						class="token-select"
						@click="toggleDropdown"
						:disabled="!account"
					>
						<span v-if="selectedToken" class="token-selected">
							<span class="token-icon">{{
								selectedToken.charAt(0)
							}}</span>
							{{ selectedToken }}
						</span>
						<span v-else>Select Token ▼</span>
					</button>
					<div
						v-if="dropdownOpen"
						class="dropdown-backdrop"
						@click="toggleDropdown"
					></div>
					<ul v-if="dropdownOpen" class="dropdown-menu">
						<li
							v-for="(address, token) in tokens"
							:key="token"
							@click="selectToken(token, address)"
							class="dropdown-item"
						>
							<span class="token-icon">{{
								token.charAt(0)
							}}</span>
							<span class="token-name">{{ token }}</span>
						</li>
					</ul>
				</div>

				<div class="input-group">
					<label>Amount</label>
					<div class="input-with-actions">
						<input
							v-model="amount"
							type="number"
							placeholder="0.0"
							class="amount-input"
							:disabled="!account"
						/>
						<button
							v-if="account"
							class="max-button"
							@click="setMaxAmount"
						>
							MAX
						</button>
					</div>
				</div>

				<div class="input-group recipient-group">
					<label>Recipient</label>
					<div class="recipient-display">
						<div class="recipient-id">
							{{ recipient.substring(0, 10) }}...{{
								recipient.substring(recipient.length - 4)
							}}
						</div>
						<div class="recipient-badge">Fixed Destination</div>
					</div>
				</div>

				<button
					class="lift-button"
					@click="showConfirmationModal"
					:disabled="!account || !selectedToken || !amount"
					:class="{ ready: account && selectedToken && amount }"
				>
					<span class="lift-icon">↗</span>
					<span>Lift Assets</span>
				</button>

				<div class="info-box">
					<div class="info-icon">ℹ️</div>
					<p>
						Assets will be transferred to the recipient on the
						destination chain. This process typically takes 2-5
						minutes to complete.
					</p>
				</div>
			</div>
		</div>

		<!-- Confirmation Modal -->
		<div
			v-if="confirmModalVisible"
			class="modal-backdrop"
			@click.self="confirmModalVisible = false"
		>
			<div class="modal-container">
				<div class="modal-header">
					<h3>Confirm Transaction</h3>
					<button
						class="close-button"
						@click="confirmModalVisible = false"
					>
						×
					</button>
				</div>
				<div class="modal-body">
					<div class="transaction-details">
						<div class="detail-row">
							<span class="detail-label">Token</span>
							<span class="detail-value">{{
								selectedToken
							}}</span>
						</div>
						<div class="detail-row">
							<span class="detail-label">Amount</span>
							<span class="detail-value">{{ amount }}</span>
						</div>
						<div class="detail-row">
							<span class="detail-label">Recipient</span>
							<span class="detail-value truncated">{{
								recipient
							}}</span>
						</div>
					</div>
					<div class="modal-message">
						Are you sure you want to lift these assets to the
						destination chain?
					</div>
				</div>
				<div class="modal-footer">
					<button
						class="modal-button cancel"
						@click="confirmModalVisible = false"
					>
						Cancel
					</button>
					<button class="modal-button confirm" @click="lift">
						Confirm
					</button>
				</div>
			</div>
		</div>

		<!-- Status Modal -->
		<div v-if="statusModalVisible" class="modal-backdrop">
			<div class="modal-container status-modal">
				<div class="modal-header">
					<h3>{{ statusModalTitle }}</h3>
					<button
						v-if="canCloseStatusModal"
						class="close-button"
						@click="statusModalVisible = false"
					>
						×
					</button>
				</div>
				<div class="modal-body">
					<div class="status-icon" :class="statusModalIcon"></div>
					<div class="modal-message">{{ statusModalMessage }}</div>
					<div
						v-if="statusModalLoading"
						class="loading-spinner"
					></div>
				</div>
				<div class="modal-footer" v-if="canCloseStatusModal">
					<button
						class="modal-button confirm"
						@click="statusModalVisible = false"
					>
						Close
					</button>
				</div>
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
			confirmModalVisible: false,
			statusModalVisible: false,
			statusModalTitle: '',
			statusModalMessage: '',
			statusModalIcon: '',
			statusModalLoading: false,
			canCloseStatusModal: true,
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
					this.showStatusModal(
						'Connection Failed',
						error.message || 'Could not connect to wallet',
						'error'
					);
				}
			} else {
				this.showStatusModal(
					'Wallet Not Found',
					'Please install MetaMask or another Ethereum wallet',
					'error'
				);
			}
		},
		async ensureSepoliaNetwork() {
			try {
				const currentNetwork = await window.ethereum.request({
					method: 'net_version',
				});
				if (currentNetwork !== '11155111') {
					this.showStatusModal(
						'Switching Network',
						'Please confirm network switch to Sepolia in your wallet',
						'loading',
						true
					);
					this.canCloseStatusModal = false;

					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [
							{
								chainId: '0xAA36A7',
								rpcUrls: [
									'https://rpc.sepolia.org',
									'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
								],
							},
						], // Sepolia Chain ID in Hex (11155111)
					});

					this.statusModalVisible = false;
					this.canCloseStatusModal = true;
				}
			} catch (error) {
				// If Sepolia is not available, add it
				if (error.code === 4902) {
					try {
						this.showStatusModal(
							'Adding Network',
							'Please confirm adding Sepolia network in your wallet',
							'loading',
							true
						);
						this.canCloseStatusModal = false;

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

						this.statusModalVisible = false;
						this.canCloseStatusModal = true;
					} catch (addError) {
						console.error(
							'Error adding Sepolia network:',
							addError
						);
						this.showStatusModal(
							'Network Error',
							'Failed to add Sepolia network',
							'error'
						);
						this.canCloseStatusModal = true;
					}
				} else {
					console.error('Error switching network:', error);
					this.showStatusModal(
						'Network Error',
						'Failed to switch to Sepolia network',
						'error'
					);
					this.canCloseStatusModal = true;
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
			if (this.account) {
				this.dropdownOpen = !this.dropdownOpen;
			}
		},
		selectToken(token, address) {
			this.selectedToken = token;
			this.selectedTokenAddress = address;
			this.dropdownOpen = false;
		},
		async setMaxAmount() {
			if (this.selectedToken === 'ETH') {
				// Leave a small amount for gas
				const maxAmount = parseFloat(this.balance) - 0.01;
				this.amount = maxAmount > 0 ? maxAmount.toString() : '0';
			} else {
				// For ERC20 tokens, would need to fetch token balance
				this.showStatusModal(
					'Coming Soon',
					'MAX function for ERC20 tokens is coming soon',
					'info'
				);
			}
		},
		showConfirmationModal() {
			if (this.account && this.selectedToken && this.amount) {
				this.confirmModalVisible = true;
			}
		},
		showStatusModal(title, message, icon, loading = false) {
			this.statusModalTitle = title;
			this.statusModalMessage = message;
			this.statusModalIcon = icon;
			this.statusModalLoading = loading;
			this.statusModalVisible = true;
		},
		async lift() {
			this.confirmModalVisible = false;

			if (
				!this.selectedToken ||
				!this.amount ||
				!this.recipient ||
				!this.account
			) {
				this.showStatusModal(
					'Invalid Input',
					'Please ensure all fields are properly filled',
					'error'
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

					this.showStatusModal(
						'Transaction Pending',
						'Please confirm the transaction in your wallet',
						'loading',
						true
					);
					this.canCloseStatusModal = false;

					// Call liftETH function with value parameter
					tx = await contract.liftETH(
						'0xa2d3849213bfc753986b21637a2d0cc39a0f895d47dc50cea1065fc25c0c2809',
						{
							value: parsedAmount,
							gasPrice: ethers.parseUnits('200', 'gwei'),
							gasLimit: 300000,
						}
					);
				} else {
					// For ERC20 tokens
					parsedAmount = ethers.parseUnits(
						this.amount.toString(),
						18
					); // Assuming 18 decimals for all tokens

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
							this.showStatusModal(
								'Approval Needed',
								'Please approve the token transfer in your wallet',
								'loading',
								true
							);
							this.canCloseStatusModal = false;

							const approveTx = await tokenContract.approve(
								this.contractAddress,
								parsedAmount
							);

							// Wait for approval confirmation
							await approveTx.wait();

							this.showStatusModal(
								'Approval Confirmed',
								'Token transfer approved. Proceeding with lift...',
								'success',
								true
							);
							setTimeout(() => {
								this.showStatusModal(
									'Transaction Pending',
									'Please confirm the transaction in your wallet',
									'loading',
									true
								);
							}, 2000);
						} catch (approvalError) {
							console.error('Approval error:', approvalError);
							this.showStatusModal(
								'Approval Failed',
								approvalError.message || 'Transaction rejected',
								'error'
							);
							this.canCloseStatusModal = true;
							return;
						}
					} else {
						this.showStatusModal(
							'Transaction Pending',
							'Please confirm the transaction in your wallet',
							'loading',
							true
						);
						this.canCloseStatusModal = false;
					}

					// Call lift function
					tx = await contract.lift(
						this.selectedTokenAddress,
						'0xa2d3849213bfc753986b21637a2d0cc39a0f895d47dc50cea1065fc25c0c2809',
						parsedAmount
					);
				}

				this.showStatusModal(
					'Processing',
					'Transaction submitted. Waiting for confirmation...',
					'loading',
					true
				);

				// Wait for transaction confirmation
				const receipt = await tx.wait();

				if (receipt.status === 1) {
					this.showStatusModal(
						'Success',
						`Your ${this.amount} ${
							this.selectedToken
						} has been lifted to ${this.recipient.substring(
							0,
							10
						)}...${this.recipient.substring(
							this.recipient.length - 4
						)}`,
						'success'
					);
					this.canCloseStatusModal = true;

					// Reset form
					this.amount = '';

					// Refresh balance
					await this.fetchBalance();
				} else {
					this.showStatusModal(
						'Transaction Failed',
						'Transaction completed but may have failed. Please check your wallet for details.',
						'error'
					);
					this.canCloseStatusModal = true;
				}
			} catch (error) {
				console.error('Lift transaction error:', error);

				// Handle specific error cases
				if (error.code === 'ACTION_REJECTED') {
					this.showStatusModal(
						'Transaction Rejected',
						'You rejected the transaction',
						'error'
					);
				} else if (error.code === 'INSUFFICIENT_FUNDS') {
					this.showStatusModal(
						'Insufficient Funds',
						'You do not have enough funds to complete this transaction',
						'error'
					);
				} else if (error.data && error.data.message) {
					this.showStatusModal(
						'Transaction Failed',
						error.data.message,
						'error'
					);
				} else {
					this.showStatusModal(
						'Error',
						error.message || 'Unknown error occurred',
						'error'
					);
				}
				this.canCloseStatusModal = true;
			}
		},
	},
};
</script>

<style>
:root {
	--primary-color: #6459ff;
	--primary-dark: #4a40cc;
	--accent-color: #ff6b3d;
	--background-dark: #0d111c;
	--card-background: #131a2a;
	--border-color: #202c43;
	--text-color: #ffffff;
	--text-secondary: #99a1bd;
	--warning-color: #ff9900;
	--success-color: #4caf50;
	--error-color: #ff5252;
	--gold-light: #ffd700;
	--gold-dark: #b8860b;
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

body {
	font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont,
		sans-serif;
	background-color: var(--background-dark);
	color: var(--text-color);
	line-height: 1.5;
}

.app-container {
	max-width: 480px;
	margin: 0 auto;
	padding: 20px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30px;
	padding: 20px 0;
}

.logo {
	display: flex;
	align-items: center;
	gap: 10px;
}

.logo-icon {
	width: 34px;
	height: 34px;
	filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
}

.logo-text {
	font-size: 24px;
	font-weight: 800;
	background: linear-gradient(to right, var(--gold-light), var(--gold-dark));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	text-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.logo-accent {
	color: var(--accent-color);
	-webkit-text-fill-color: var(--accent-color);
}

.connection-area {
	display: flex;
	align-items: center;
	gap: 10px;
}

.account-info {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-right: 10px;
}

.account-badge {
	display: flex;
	align-items: center;
	background: rgba(255, 255, 255, 0.07);
	padding: 6px 12px;
	border-radius: 16px;
	font-size: 14px;
	font-weight: 500;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.dot {
	width: 8px;
	height: 8px;
	background-color: #10b981;
	border-radius: 50%;
	margin-right: 8px;
	box-shadow: 0 0 6px #10b981;
}

.account-text {
	color: var(--text-color);
}

.balance-display {
	font-size: 12px;
	color: var(--text-secondary);
	margin-top: 4px;
}

.connect-button,
.wallet-connect-button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	background: var(--primary-color);
	color: white;
	border: none;
	padding: 10px 16px;
	border-radius: 8px;
	font-weight: 600;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.2s ease;
	box-shadow: 0 4px 12px rgba(100, 89, 255, 0.3);
	position: relative;
	overflow: hidden;
}

.connect-button:before,
.wallet-connect-button:before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(
		90deg,
		transparent,
		rgba(255, 255, 255, 0.1),
		transparent
	);
	transition: 0.6s;
}

.connect-button:hover:before,
.wallet-connect-button:hover:before {
	left: 100%;
}

.connect-button:hover,
.wallet-connect-button:hover {
	background: var(--primary-dark);
	transform: translateY(-1px);
	box-shadow: 0 6px 14px rgba(100, 89, 255, 0.4);
}

.connect-button.connected {
	background-color: rgba(255, 255, 255, 0.1);
	color: var(--text-color);
	border: 1px solid rgba(255, 255, 255, 0.2);
	box-shadow: none;
}

.connect-button.connected:hover {
	background-color: rgba(255, 255, 255, 0.15);
}

.button-icon {
	font-size: 16px;
}

.wallet-connect-button {
	background-color: #3b99fc;
}

.wallet-connect-button:hover {
	background-color: #2172e5;
}

.wc-icon {
	width: 20px;
	height: 20px;
}

.card {
	background: var(--card-background);
	border-radius: 16px;
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
	padding: 24px;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	border: 1px solid var(--border-color);
	backdrop-filter: blur(5px);
	position: relative;
}

.card:before {
	content: '';
	position: absolute;
	top: -1px;
	left: -1px;
	right: -1px;
	height: 1px;
	background: linear-gradient(
		90deg,
		transparent,
		var(--gold-light),
		transparent
	);
	opacity: 0.3;
	border-radius: 16px 16px 0 0;
}

.card:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.card-title {
	font-size: 20px;
	font-weight: 700;
	margin-bottom: 24px;
	color: var(--text-color);
	text-align: center;
	text-shadow: 0 0 15px rgba(255, 215, 0, 0.15);
}

.card-body {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.dropdown {
	position: relative;
}

.token-select {
	width: 100%;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid var(--border-color);
	color: var(--text-color);
	padding: 14px 16px;
	border-radius: 10px;
	font-weight: 600;
	font-size: 16px;
	cursor: pointer;
	text-align: left;
	display: flex;
	align-items: center;
	transition: all 0.2s ease;
}

.token-select:not(:disabled):hover {
	background: rgba(255, 255, 255, 0.1);
	border-color: rgba(255, 255, 255, 0.2);
}

.token-select:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.token-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	background: linear-gradient(
		135deg,
		var(--primary-color),
		var(--primary-dark)
	);
	color: white;
	border-radius: 50%;
	margin-right: 10px;
	font-weight: 700;
	box-shadow: 0 0 10px rgba(100, 89, 255, 0.3);
}

.dropdown-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;
}

.dropdown-menu {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: var(--card-background);
	border: 1px solid var(--border-color);
	border-radius: 10px;
	list-style: none;
	padding: 8px 0;
	margin-top: 8px;
	z-index: 20;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
	max-height: 250px;
	overflow-y: auto;
	backdrop-filter: blur(10px);
}

.dropdown-item {
	padding: 12px 16px;
	cursor: pointer;
	display: flex;
	align-items: center;
	transition: background 0.2s ease;
}

.dropdown-item:hover {
	background: rgba(255, 255, 255, 0.1);
}

.token-name {
	font-weight: 600;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.input-group label {
	font-size: 14px;
	font-weight: 600;
	color: var(--text-secondary);
}

.input-with-actions {
	position: relative;
	display: flex;
	align-items: center;
}

.amount-input {
	width: 100%;
	padding: 14px 16px;
	border: 1px solid var(--border-color);
	border-radius: 10px;
	font-size: 16px;
	font-weight: 500;
	outline: none;
	transition: all 0.2s ease;
	background: rgba(255, 255, 255, 0.05);
	color: var(--text-color);
}

.amount-input:not(:disabled):focus {
	border-color: var(--primary-color);
	box-shadow: 0 0 0 2px rgba(100, 89, 255, 0.2);
}

.amount-input:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.max-button {
	position: absolute;
	right: 10px;
	background: var(--accent-color);
	color: white;
	border: none;
	padding: 6px 10px;
	border-radius: 6px;
	font-size: 12px;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s ease;
	box-shadow: 0 2px 8px rgba(255, 107, 61, 0.3);
}

.max-button:hover {
	background: #e05a2f;
	transform: translateY(-1px);
	box-shadow: 0 4px 10px rgba(255, 107, 61, 0.4);
}

.recipient-group {
	margin-bottom: 5px;
}

.recipient-display {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: rgba(255, 255, 255, 0.05);
	padding: 14px 16px;
	border-radius: 10px;
	border: 1px dashed var(--border-color);
}

.recipient-id {
	font-size: 14px;
	font-weight: 600;
	color: var(--text-color);
	font-family: monospace;
}

.recipient-badge {
	background: var(--primary-color);
	color: white;
	padding: 4px 8px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 600;
	box-shadow: 0 0 10px rgba(100, 89, 255, 0.3);
}

.lift-button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	background: var(--accent-color);
	color: white;
	border: none;
	padding: 16px;
	border-radius: 10px;
	font-weight: 700;
	font-size: 16px;
	cursor: pointer;
	transition: all 0.3s ease;
	margin-top: 10px;
	position: relative;
	overflow: hidden;
}

.lift-button:before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(
		90deg,
		transparent,
		rgba(255, 255, 255, 0.1),
		transparent
	);
	transition: 0.6s;
}

.lift-button:not(:disabled):hover:before {
	left: 100%;
}

.lift-button:disabled {
	background: rgba(255, 255, 255, 0.1);
	color: var(--text-secondary);
	cursor: not-allowed;
}

.lift-button.ready {
	background: linear-gradient(135deg, var(--accent-color), #e05a2f);
	box-shadow: 0 4px 12px rgba(255, 107, 61, 0.4);
}

.lift-button.ready:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px rgba(255, 107, 61, 0.5);
}

.lift-icon {
	font-size: 18px;
}

.info-box {
	display: flex;
	gap: 12px;
	background: rgba(59, 130, 246, 0.1);
	border: 1px solid rgba(59, 130, 246, 0.2);
	border-radius: 10px;
	padding: 16px;
	margin-top: 20px;
}

.info-icon {
	font-size: 20px;
}

.info-box p {
	font-size: 14px;
	color: #93c5fd;
	margin: 0;
}

/* Modal Styles */
.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	backdrop-filter: blur(5px);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 100;
}

.modal-container {
	background: var(--card-background);
	border-radius: 16px;
	width: 95%;
	max-width: 420px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
	border: 1px solid var(--border-color);
	position: relative;
	overflow: hidden;
}

.modal-container:before {
	content: '';
	position: absolute;
	top: -1px;
	left: -1px;
	right: -1px;
	height: 1px;
	background: linear-gradient(
		90deg,
		transparent,
		var(--gold-light),
		transparent
	);
	opacity: 0.3;
	border-radius: 16px 16px 0 0;
}

.modal-header {
	padding: 16px;
	border-bottom: 1px solid var(--border-color);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.modal-header h3 {
	margin: 0;
	font-size: 18px;
	font-weight: 700;
	color: var(--text-color);
}

.close-button {
	background: none;
	border: none;
	color: var(--text-secondary);
	font-size: 24px;
	cursor: pointer;
	padding: 0;
	line-height: 1;
}

.close-button:hover {
	color: var(--text-color);
}

.modal-body {
	padding: 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.transaction-details {
	width: 100%;
	margin-bottom: 20px;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	padding: 10px 0;
	border-bottom: 1px solid var(--border-color);
}

.detail-row:last-child {
	border-bottom: none;
}

.detail-label {
	color: var(--text-secondary);
	font-weight: 500;
}

.detail-value {
	color: var(--text-color);
	font-weight: 600;
}

.truncated {
	max-width: 220px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.modal-message {
	margin: 15px 0;
	color: var(--text-color);
	font-size: 16px;
	line-height: 1.5;
}

.modal-footer {
	padding: 16px;
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	border-top: 1px solid var(--border-color);
}

.modal-button {
	padding: 10px 20px;
	border-radius: 8px;
	font-weight: 600;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.modal-button.cancel {
	background: rgba(255, 255, 255, 0.1);
	color: var(--text-color);
	border: 1px solid var(--border-color);
}

.modal-button.cancel:hover {
	background: rgba(255, 255, 255, 0.15);
}

.modal-button.confirm {
	background: var(--accent-color);
	color: white;
	border: none;
	box-shadow: 0 2px 8px rgba(255, 107, 61, 0.3);
}

.modal-button.confirm:hover {
	background: #e05a2f;
	transform: translateY(-1px);
	box-shadow: 0 4px 10px rgba(255, 107, 61, 0.4);
}

.status-modal .status-icon {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.status-icon.loading:before {
	content: '';
	border: 4px solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	border-top: 4px solid var(--primary-color);
	width: 40px;
	height: 40px;
	animation: spin 1s linear infinite;
}

.status-icon.success {
	background: rgba(76, 175, 80, 0.1);
	border: 2px solid var(--success-color);
}

.status-icon.success:before {
	content: '✓';
	color: var(--success-color);
	font-size: 32px;
	font-weight: bold;
}

.status-icon.error {
	background: rgba(255, 82, 82, 0.1);
	border: 2px solid var(--error-color);
}

.status-icon.error:before {
	content: '✕';
	color: var(--error-color);
	font-size: 32px;
	font-weight: bold;
}

.status-icon.info {
	background: rgba(59, 130, 246, 0.1);
	border: 2px solid #3b82f6;
}

.status-icon.info:before {
	content: 'i';
	color: #3b82f6;
	font-size: 32px;
	font-weight: bold;
	font-style: italic;
}

.loading-spinner {
	margin-top: 20px;
	width: 40px;
	height: 40px;
	border: 4px solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	border-top: 4px solid var(--primary-color);
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

@media (max-width: 480px) {
	.header {
		flex-direction: column;
		gap: 15px;
	}

	.connection-area {
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
	}

	.connect-button,
	.wallet-connect-button {
		flex: 1;
		min-width: 120px;
	}

	.account-info {
		width: 100%;
		align-items: center;
		margin-right: 0;
		margin-bottom: 10px;
	}
}
</style>
