// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface IRewardToken {
    function mint(address to, uint256 amount) external;
}

contract ReadifySubmissionManager is AccessControl {
    bytes32 public constant TEACHER_ROLE = keccak256("TEACHER_ROLE");

    IRewardToken public token;

    struct ReadingSummary {
        string readerName;
        string bookTitle;
        string summaryHash;
        uint256 duration;
        uint256 timestamp;
        address readerWallet;
        bool approved;
        bool rewarded;
    }

    mapping(address => ReadingSummary[]) public readerSubmissions;

    event SummarySubmitted(address indexed student, string bookTitle, uint256 index);
    event TokensIssued(address indexed student, string bookTitle, uint256 tokens);
    event SummaryApproved(address indexed student, uint256 index);

    constructor(address _tokenAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(TEACHER_ROLE, msg.sender); // Deployer is also teacher
        token = IRewardToken(_tokenAddress);
    }

    function submitSummary(
        string memory _readerName,
        string memory _bookTitle,
        string memory _summaryHash,
        uint256 _duration
    ) public {
        require(bytes(_readerName).length > 0, "Name required");
        require(bytes(_bookTitle).length > 0, "Title required");
        require(bytes(_summaryHash).length > 0, "Hash required");
        require(_duration > 0, "Duration must be > 0");

        ReadingSummary memory summary = ReadingSummary({
            readerName: _readerName,
            bookTitle: _bookTitle,
            summaryHash: _summaryHash,
            duration: _duration,
            timestamp: block.timestamp,
            readerWallet: msg.sender,
            approved: false,
            rewarded: false
        });

        readerSubmissions[msg.sender].push(summary);
        emit SummarySubmitted(msg.sender, _bookTitle, readerSubmissions[msg.sender].length - 1);
    }

    function approveAndReward(address student, uint256 index) public onlyRole(TEACHER_ROLE) {
        require(index < readerSubmissions[student].length, "Invalid index");

        ReadingSummary storage summary = readerSubmissions[student][index];
        require(!summary.approved, "Already approved");
        require(!summary.rewarded, "Already rewarded");

        summary.approved = true;
        summary.rewarded = true;

        uint256 tokenAmount = summary.duration * 1e18;
        token.mint(summary.readerWallet, tokenAmount);

        emit SummaryApproved(student, index);
        emit TokensIssued(summary.readerWallet, summary.bookTitle, tokenAmount);
    }

    function addTeacher(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(TEACHER_ROLE, account);
    }

    function removeTeacher(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(TEACHER_ROLE, account);
    }

    function isTeacher(address account) public view returns (bool) {
        return hasRole(TEACHER_ROLE, account);
    }
}
