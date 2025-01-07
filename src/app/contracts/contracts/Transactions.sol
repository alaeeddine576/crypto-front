// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transactions {
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] private transactions;
    uint256 public transactionCount;

    event Transfer(
        address indexed from,
        address indexed to,
        uint amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    function addToBlockChain(
        address payable receiver,
        uint amount,
        string memory message,
        string memory keyword
    ) public payable {
        require(amount > 0, "Amount must be greater than zero");
        require(receiver != address(0), "Invalid receiver address");

        transactions.push(
            TransferStruct({
                sender: msg.sender,
                receiver: receiver,
                amount: amount,
                message: message,
                timestamp: block.timestamp,
                keyword: keyword
            })
        );

        transactionCount++;
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    receive() external payable {}
}
