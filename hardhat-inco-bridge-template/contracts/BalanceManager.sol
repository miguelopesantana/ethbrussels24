// SPDX-License-Identifier: Apache-2.0

/* 
This contract is an example contract to demonstrate 
the cross-chain function call using ExcuteAPI 
on the base chain.
*/

pragma solidity >=0.8.13 <=0.8.19;

import "./Common.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IHiddenCard {
    function returnCard(uint256 amount) external returns (uint8);

    function returnCardDep(address user, uint256 amount, address darkPoolAddress) external returns (uint8);

    function returnCardWith(address user, uint256 amount, address darkPoolAddress) external returns (uint8);
}

/**
 * Inco Network Card contract
 * @author
 * @notice
 */
contract Card is BridgeContract, Ownable {
    bytes32 messageId;
    mapping(address => uint8) public Cards;

    /* function CardGet(address user, uint256 amount) public {
        IHiddenCard _Hiddencard = IHiddenCard(hiddencard);

        bytes memory _callback = abi.encodePacked(this.cardReceive.selector, (uint256(uint160(user))));

        messageId = IInterchainExecuteRouter(iexRouter).callRemote(
            DestinationDomain,
            address(_Hiddencard),
            0,
            abi.encodeCall(_Hiddencard.returnCard, (amount)),
            _callback
        );
    }
 */
    function cardReceiveWith(uint256 user, uint8 _amount) external {
        require(caller_contract == msg.sender, "not right caller contract");
        Cards[address(uint160(user))] = _amount;

        address tokenERC20 = getMirroredERC20(hiddencard);
        address evmERC20 = erc20ToMirroredERC20[tokenERC20];
        IERC20(evmERC20).transfer(address(uint160(user)), _amount);
    }

    function cardReceiveDep(uint256 user, uint8 _amount) external {
        require(caller_contract == msg.sender, "not right caller contract");
        Cards[address(uint160(user))] = _amount;
    }

    /* 
    function CardView(address user) public view returns (uint8) {
        return Cards[user];
    } */

    // logic for token transfer
    event TokenAllowed(address token, bool allowed);
    event NewDarkPoolAddress(address darkPoolAddress);
    event NewMirroredERC20(address fherc20, address erc20);

    address public darkPoolAddress;

    // address of the mirrored ERC20 contract on the EVM
    // fherc20 => ERC20
    mapping(address => address) erc20ToMirroredERC20;

    constructor(address _darkPoolAddress) {
        transferOwnership(msg.sender);
        darkPoolAddress = _darkPoolAddress;
    }

    function getDarkPoolAddress() public view returns (address) {
        return darkPoolAddress;
    }

    function setDarkPoolAddress(address _darkPoolAddress) public onlyOwner {
        darkPoolAddress = _darkPoolAddress;
        emit NewDarkPoolAddress(_darkPoolAddress);
    }

    function setMirroredERC20(address fherc20, address erc20) public onlyOwner {
        erc20ToMirroredERC20[fherc20] = erc20;
        emit NewMirroredERC20(fherc20, erc20);
    }

    function getMirroredERC20(address fherc20) public view returns (address) {
        return erc20ToMirroredERC20[fherc20];
    }

    // deposits the ERC20 token into the EVM contract and then calls FHEVM to adds the mirrored token to the user's account
    function depositAndPortToken(uint256 amount, address user, address token) external {
        // call FHEVM to add the mirrored token to the user's account
        IHiddenCard _Hiddencard = IHiddenCard(token);
        address tokenERC20 = getMirroredERC20(address(_Hiddencard));

        // require(allowedTokens[token], "LiquidityPool: token not allowed");
        require(
            IERC20(tokenERC20).allowance(msg.sender, address(this)) >= amount,
            "LiquidityPool: insufficient allowance"
        );

        require(darkPoolAddress != address(0), "LiquidityPool: darkPoolAddress not set");

        bytes memory _callback = abi.encodePacked(this.cardReceiveWith.selector, (uint256(uint160(user))));

        messageId = IInterchainExecuteRouter(iexRouter).callRemote(
            DestinationDomain,
            address(_Hiddencard),
            0,
            abi.encodeCall(_Hiddencard.returnCardDep, (msg.sender, amount, darkPoolAddress)),
            _callback
        );
    }

    // redeems the ERC20 token from the EVM contract and then calls FHEVM to burn the mirrored token from the user's account
    function redeemTokenAndBurn(uint256 amount, address user, address token) external {
        IHiddenCard _Hiddencard = IHiddenCard(token);
        address tokenERC20 = getMirroredERC20(address(_Hiddencard));

        // require(allowedTokens[token], "LiquidityPool: token not allowed");
        require(IERC20(tokenERC20).balanceOf(address(this)) >= amount, "LiquidityPool: insufficient balance");

        bytes memory _callback = abi.encodePacked(this.cardReceiveDep.selector, (uint256(uint160(user))));

        messageId = IInterchainExecuteRouter(iexRouter).callRemote(
            DestinationDomain,
            address(_Hiddencard),
            0,
            abi.encodeCall(_Hiddencard.returnCardWith, (msg.sender, amount, darkPoolAddress)),
            _callback
        );
    }
}
