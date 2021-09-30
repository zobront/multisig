// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Multisig {
	struct Request {
		uint id;
		address to;
		uint amount;
		uint votes;
		uint end;
		mapping(address => bool) voters;
		bool executed;
	}

	address public admin;
	mapping(address => bool) public isASigner;
	uint public signerCount;
	uint public sigsNeeded;
	uint public nextRequestId;
	mapping(uint => Request) public requests;

	constructor() {
		admin = msg.sender;
		isASigner[msg.sender] = true;
		signerCount = 1;
		sigsNeeded = 1;
	}

	function addSigner(address _signer) public adminOnly() {
		isASigner[_signer] = true;
		signerCount++;
	}

	function removeSigner(address _signer) public adminOnly() {
		isASigner[_signer] = false;
		signerCount--;
	}

	function updateSignaturesNeeded(uint _sigs) public adminOnly() {
		require(_sigs > 0, 'must require some signatures');
		require(_sigs <= signerCount, 'you dont have that many signers');
		sigsNeeded = _sigs;
	}

	function makeRequest(address payable _to, uint _amount) public {
		require(_amount <= address(this).balance, 'amount larger than balance');
		Request storage request = requests[nextRequestId];
		request.id = nextRequestId;
		request.to = _to;
		request.amount = _amount;
		request.votes = 1;
		request.end = block.timestamp + 1 days;
		request.voters[msg.sender] = true;
		nextRequestId++;
	}

	function vote(uint requestId) public {
		require(isASigner[msg.sender] == true, 'you arent a signer');
		require(requests[requestId].voters[msg.sender] == false, 'you already voted');
		require(requests[requestId].executed == false, 'already paid out');
		require(block.timestamp < requests[requestId].end, 'voting is over');
		requests[requestId].votes++;
		requests[requestId].voters[msg.sender] = true;
	}

	function execute(uint requestId) public {
		require(requests[requestId].votes >= sigsNeeded, 'not enough sigs');
		require(requests[requestId].executed == false, 'already paid out');
		payable(requests[requestId].to).transfer(requests[requestId].amount);
		requests[requestId].executed = true;
	}

	receive() external payable {}

	modifier adminOnly() {
		require(msg.sender == admin);
		_;
	}

	


}