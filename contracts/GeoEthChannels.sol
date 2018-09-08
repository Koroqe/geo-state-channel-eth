pragma solidity ^0.4.24;

import './lib/ECVerify.sol';

contract GeoEthChannelsVer2 {

    /// STORAGE

    uint256 closingTimeout = 5760; //approx 24 hours

    uint256 channelsCount;

    mapping(bytes32 => Channel) public channels; // map of all channels, bytes32 -> Channel
    mapping(uint256 => ClosingRequest) public closingRequests; // map of all closing requests, channel_id -> CloseRequest

    enum ChannelStates {
        Uninitialized,
        Unidirectional,
        Bidirectional,
        Settled,
        Closed
    }

    struct Channel {
        address alice;
        address bob;
        ChannelStates state;
        uint256 balanceAlice;
        uint256 balanceBob;
    }

    struct ClosingRequest {
        uint256 closingRequested; //number of block at which request created
        uint256 auditEpoch;
        uint128 aliceNonce;
        uint128 bobNonce;
    }

    /// EXTERNAL

    function getChannelDetails(
        bytes32 channelID)
    external
    returns(
        address alice,
        address bob,
        uint8 state,
        uint256 balanceAlice,
        uint256 balanceBob)
    {
        alice = channels[channelID].alice;
        bob = channels[channelID].bob;
        state = uint8(channels[channelID].state);
        balanceAlice = channels[channelID].balanceAlice;
        balanceBob = channels[channelID].balanceBob;
    }

    function getClosingRequestDetails(
        bytes32 channelID)
    external
    returns(
        uint256 closingRequested,
        uint256 channelEpoch,
        uint128 aliceNonce,
        uint128 bobNonce)
    {
        closingReqested = closingRequests[channelID].closingRequested;
        channelEpoch = closingRequests[channelID].channelEpoch;
        aliceNonce = closingRequests[channelID].aliceNonce;
        bobNonce = closingRequests[channelID].bobNonce;
    }

    /// @dev creates unidirectional channel
    function openChannel(
        address bob)
    external
    payable
    {
        // getting channel id
        bytes32 channelID = calcChannelID(msg.sender, bob);

        // make sure, that channel haven't opened before
        require(channels[channelID].state == ChannelStates.Uninitialized);

        // initialize channel
        channels[channelID] = Channel({
            alice: msg.sender,
            bob: receiver,
            state: ChannelStates.Unidirectional,
            balanceAlice: msg.value,
            balanceBob: 0
        });
        emit ChannelCreated(channelID);
    }

    /// @dev makes channel bidirectional
    function respondChannel(
        address alice,
        uint256 amount)
    external
    payable
    {
        bytes32 channelID = calcChannelID(msg.sender, alice);

        // make sure, that channel still opened
        require(channels[channelID].state == ChannelStates.Unidirectional);
        // make sure, that bob tries to respond channel with non zero value
        require(msg.value != 0);
        // make sure, that bob didn't responded yet
        require(channels[channelID].balanceBob = 0);
        // make sure, that it is not alice responded
        require(msg.sender != channels[channelID].alice);

        // update channel
        channels[channelID].balanceBob = msg.value;
        channels[channelID].state = ChannelStates.Bidirectional;

        emit ChannelResponded(channelID);
    }

    function auditProofSettlement(
        bytes32 channelID,
        uint256 auditEpoch,
        uint256 balanceAlice,
        uint256 balanceBob,
        bytes signatureAlice,
        bytes signatureBob)
    external
    {
        // make sure channel still not closed or uninitialized
        require(channels[channelID].state != ChannelStates.Closed);
        require(channels[channelID].state != ChannelStates.Uninitialized);

        // make sure that audit epoch bigger than stored now
        require(closingRequests[channelID].channelEpoch < auditEpoch);

        // make sure that channel not ready to close
        require(closingRequests[channelID].closingRequested + closingTimeout > block.number);

        // verify alice's signature of message
        require(channels[channelID].alice == extractAuditProofSettlementSignature(
            channelID,
            auditEpoch,
            aliceBalance,
            bobBalance,
            signatureAlice
        ));

        // verify bob's signature of message
        require(channels[channelID].bob == extractAuditProofSettlementSignature(
            channelID,
            auditEpoch,
            aliceBalance,
            bobBalance,
            signatureBob
        ));

        // set settlement data if closing not requested yet
        if (closingRequests[channelID].closingRequested == 0) {
            closingRequests[channelID].closingRequested = block.number;
            channels[channelID].state = uint8(ChannelStates.Settlement);
            emit ChannelSettled(channelID);
        }

        // update channel and request data
        channels[channelID].balanceAlice = balanceAlice;
        channels[channelID].balanceBob = balanceBob;
        closingRequests[channelID].auditEpoch = auditEpoch;

        emit NewAuditProofs(channelID);
    }

    function receiptsProofSettlement(
        bytes32 channelID
    )
    external
    {

        // make sure that channel still not closed or uninitialized
        require(channels[channelID].state != uint8(ChannelStates.Closed));
        require(channels[channelID].state != uint8(ChannelStates.Uninitialized));

        // set settlement if closing not requested yet
        if (closingRequests[channelID].closingRequested == 0) {
            closingRequests[channelID].closingRequested = block.number;
        }

        // allow to settle with receipts only from epoch 0

        // impl

        emit NewReceiptsProofs(channelID);
    }

    function cooperativeClose(
        bytes32 channelID,
        uint256 balanceAlice,
        uint256 balanceBob,
        bytes signatureAlice,
        bytes signatureBob
    )
    external
    {
        // make sure that channel opened
        require(channels[channelID].state != uint8(ChannelStates.Uninitialized));
        require(channels[channelID].state != uint8(ChannelStates.Closed));

        // verify alice's signature of message
        require(channels[channelID].alice == extractAuditProofSettlementSignature(
            channelID,
            auditEpoch,
            aliceBalance,
            bobBalance,
            signatureAlice
        ));

        // verify bob's signature of message
        require(channels[channelID].bob == extractAuditProofSettlementSignature(
            channelID,
            auditEpoch,
            aliceBalance,
            bobBalance,
            signatureBob
        ));

        // update channel data
        channels[channelID].balanceAlice = balanceAlice;
        channels[channelID].balanceBob = balanceBob;
        channels[channelID].state = ChannelStates.Closed;

        // send ether to parties
        channels[channelID].alice.transfer(balanceAlice);
        channels[channelID].bob.transfer(balanceBob);

        emit ChannelClosed(channelID);
    }

    function closeChannel(
        bytes32 channelID)
    external
    {
        // make sure that channel ready to close
        require(closingRequests[channelID].closingRequested + closingTimeout <= block.number);

        // make sure that channel still settled
        require(channels[channelID].state == uint8(ChannelStates.Settled));

        // update channel data
        channels[channelID].state = ChannelStates.Closed;

        //send ether to parties
        channels[channelID].alice.transfer(channels[channelID].balanceAlice);
        channels[channelID].bob.transfer(channels[channelID].balanceBob);

        emit ChannelClosed(channelID);
    }

    function calcChannelID(
        address alice,
        address bob)
    public
    pure
    returns(bytes32 id)
    {
        //returns id derived from both addresses
        return keccak256(alice, bob);
    }

    /// INTERNAL

    function extractAuditProofSettlementSignature(
        bytes32 channelID,
        uint256 auditEpoch,
        uint256 aliceBalance,
        uint256 bobBalance,
        bytes signature)
    internal
    returns(address signer)
    {
        bytes32 message_hash = keccak256(
            channelID,
            auditEpoch,
            aliceBalance,
            bobBalance);
        address signer = ECVerify.ecverify(message_hash, signature);
    }

    function extractCooperativeCloseSignature(
        bytes32 channelID,
        uint256 aliceBalance,
        uint256 bobBalance,
        bytes signature)
    internal
    returns(address signer)
    {
        bytes32 message_hash = keccak256(
            channelID,
            aliceBalance,
            bobBalance);
        address signer = ECVerify.ecverify(message_hash, signature);
    }

    ///EVENTS

    event ChannelCreated(bytes32 indexed _channelID);
    event ChannelResponded(bytes32 indexed _channelID);
    event ChannelSettled(bytes32 indexed _channelID);
    event ChannelClosed(bytes32 indexed _channelID);

    event NewReceiptsProofs(bytes32 indexed _channelID);
    event NewAuditProofs(bytes32 indexed _channelID);
}
