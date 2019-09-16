pragma solidity >=0.5.0 <0.6.0;

interface IERC20 {
    function balanceOf(address who) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract Lock2Pay {

    address daiAddr = address(0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359);
    address cDaiAddr = address(0xF5DCe57282A584D2746FaF1593d3121Fcac444dC);

    function approveCDai() public {
        IERC20 daiToken = IERC20(daiAddr);
        daiToken.approve(cDaiAddr, 1000000 ether);
    }

    function lockDai(uint256 amount) public {
        IERC20 daiToken = IERC20(daiAddr);
        daiToken.transferFrom(msg.sender, address(this), amount);
    }
}