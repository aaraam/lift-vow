const abi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				internalType: 'bytes',
				name: 't2PubKey',
				type: 'bytes',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'lift',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes',
				name: 't2PubKey',
				type: 'bytes',
			},
		],
		name: 'liftETH',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
];

export default abi;