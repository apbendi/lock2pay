pragma solidity >=0.5.0 <0.6.0;

interface IERC20 {
    function balanceOf(address who) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface ICERC20 {
    function mint(uint mintAmount) external returns (uint);
    function redeemUnderlying(uint redeemAmount) external returns (uint);
    function exchangeRateStored() external view returns (uint);
    function balanceOfUnderlying(address account) external returns (uint);
}

contract Lock2Pay {

    address daiAddr = address(0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359);
    address cDaiAddr = address(0xF5DCe57282A584D2746FaF1593d3121Fcac444dC);

    struct LockUp {
        uint256 amount;
        uint256 cDaiMinted;
        uint256 dateLocked;
    }

    mapping(address => LockUp) locks;
    uint256 cDaiOwed;

    function approveCDai() public {
        IERC20 daiToken = IERC20(daiAddr);
        daiToken.approve(cDaiAddr, 1000000 ether);
    }

    function lockDai(uint256 amount) public {
        require(0 == locks[msg.sender].amount, "EXISTING_BALANCE");
        IERC20 cDaiToken = IERC20(cDaiAddr);

        IERC20 daiToken = IERC20(daiAddr);
        daiToken.transferFrom(msg.sender, address(this), amount);

        ICERC20 cDai = ICERC20(cDaiAddr);
        uint256 initialBalance = cDaiToken.balanceOf(address(this));
        require(0 == cDai.mint(amount), "MINT_FAILURE");
        uint256 postBalance = cDaiToken.balanceOf(address(this));

        uint256 minted = (postBalance - initialBalance);
        cDaiOwed = cDaiOwed + minted;

        locks[msg.sender].amount = amount;
        locks[msg.sender].cDaiMinted = minted;
        locks[msg.sender].dateLocked = block.timestamp;
    }

    function redeemDai() public {
        uint256 amountLocked = locks[msg.sender].amount;
        require(amountLocked > 0, "NO_BALANCE");

        ICERC20 cDai = ICERC20(cDaiAddr);
        require(0 == cDai.redeemUnderlying(amountLocked), "REDEEM_FAILURE");

        cDaiOwed = cDaiOwed - locks[msg.sender].cDaiMinted;

        IERC20 daiToken = IERC20(daiAddr);
        daiToken.transfer(msg.sender, amountLocked);

        delete locks[msg.sender];
    }

    function contractBalances() public view returns (uint256 daiBalance, uint256 cDaiBalance, uint256 cDaiOutstanding) {
        IERC20 daiToken = IERC20(daiAddr);
        IERC20 cDaiToken = IERC20(cDaiAddr);

        return (
                daiToken.balanceOf(address(this)),
                cDaiToken.balanceOf(address(this)),
                cDaiOwed
               );
    }
}