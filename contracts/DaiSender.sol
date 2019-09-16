pragma solidity >=0.5.0 <0.6.0;

interface IERC20 {
    function balanceOf(address who) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract DaiSender {

    address sendTo = address(0x73cC3e91D67613d481cC9cfe11A1679901873656);

    function sendDai() public {
        address daiAddr = address(0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359);
        IERC20 daiToken = IERC20(daiAddr);

        daiToken.transfer(sendTo, 1 ether);
    }
}