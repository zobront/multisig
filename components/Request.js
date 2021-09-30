import { ethers } from 'ethers';
import React from 'react';

const Request = ({request, castVote, execute, sigsNeeded}) => {

	const action = () => {
		if (request.executed) {
			return ('Successfully Executed')
		}
		if (request.votes.toNumber() >= sigsNeeded) {
			return (<a href="#" onClick={() => execute(request.id.toNumber())}>Execute</a>)
		} else {
			return (<a href="#" onClick={() => castVote(request.id.toNumber())}>Vote</a>)
		}
	}

	return (
		<div className="request">
			<p>{request.to}</p>
			<p>
				{ethers.utils.formatEther(request.amount)} Ξ 
				({request.votes.toNumber()} / {sigsNeeded} Votes)
				-- {action()}
			</p>
		</div>
	)
};

export default Request;	