// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13;

import "../Hyperlane/Common.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IMintableEncryptedERC20 {
    function mintAndDepositPool(uint256 amount, address darkPool, address to) external;

    function burnAndWithdrawPool(uint256 amount, address darkPool, address to) external;
}

/*
	Contract deployed on base Sepolia
*/
contract LiquidityPool is Ownable, BridgeContract {
    // allowed tokens?
    // mapping(address => bool) public allowedTokens;

    event TokenAllowed(address token, bool allowed);
    event NewDarkPoolAddress(address darkPoolAddress);
    event NewMirroredERC20(address fherc20, address erc20);

    function setAllowedToken(address token, bool allowed) public onlyOwner {
        // allowedTokens[token] = allowed;
    }

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
    function depositAndPortToken(address fhERC20, uint256 amount) external {
        address tokenERC20 = getMirroredERC20(fhERC20);

        // require(allowedTokens[token], "LiquidityPool: token not allowed");
        require(
            IERC20(tokenERC20).allowance(msg.sender, address(this)) >= amount,
            "LiquidityPool: insufficient allowance"
        );

        require(darkPoolAddress != address(0), "LiquidityPool: darkPoolAddress not set");

        // call FHEVM to add the mirrored token to the user's account
        IMintableEncryptedERC20 _MintableERC20 = IMintableEncryptedERC20(fhERC20);

        bytes memory _callback = abi.encodePacked(this.callbackPortMinted.selector, (uint256(uint160(msg.sender))));

        /* bytes32 messageId =  */
        /* 
        IInterchainExecuteRouter(iexRouter).callRemote(
            DestinationDomain,
            address(_MintableERC20),
            0,
            abi.encodeCall(_MintableERC20.mintAndDepositPool, (amount, darkPoolAddress, msg.sender)),
            _callback
        ); */
    }

    // redeems the ERC20 token from the EVM contract and then calls FHEVM to burn the mirrored token from the user's account
    function redeemTokenAndBurn(address token, uint256 amount) external {
        // require(allowedTokens[token], "LiquidityPool: token not allowed");
        require(IERC20(token).balanceOf(address(this)) >= amount, "LiquidityPool: insufficient balance");

        // call FHEVM to add the mirrored token to the user's account
        IMintableEncryptedERC20 _MintableERC20 = IMintableEncryptedERC20(mirroredERC20Target);

        bytes memory _callback = abi.encodePacked(this.callbackPortBurnt.selector, (uint256(uint160(msg.sender))));

        /* bytes32 messageId =  */
        IInterchainExecuteRouter(iexRouter).callRemote(
            DestinationDomain,
            address(_MintableERC20),
            0,
            abi.encodeCall(_MintableERC20.burnAndWithdrawPool, (amount, darkPoolAddress, msg.sender)),
            _callback
        );
    }

    function callbackPortMinted(address user) external view returns (address) {
        require(caller_contract == msg.sender, "not right caller contract");
        return user;
    }

    function callbackPortBurnt(address user, uint8 amount, address token) external {
        require(caller_contract == msg.sender, "not right caller contract");
        // match the FHERC20 with the ERC20 token
        address evmERC20 = erc20ToMirroredERC20[token];
        IERC20(evmERC20).transfer(user, amount);
    }
}
