pragma solidity >=0.5.0 <0.6.0;

/*
DO NEXT:

- Add owner in constructor
- Make ownerOnly modifier
- Add onlyOwner function for withdrawing the cDai balance > cDaiOwed
- In aformentioned funciton, convert cDai to Dai before transferring to owner
*/

interface IERC20 {
    function balanceOf(address who) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface ICERC20 {
    function mint(uint mintAmount) external returns (uint);
    function redeemUnderlying(uint redeemAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function balanceOfUnderlying(address account) external returns (uint);
}

interface ILockNFT {
    function mint(address receiver) external;
}

contract Lock2Pay {

    address daiAddr = address(0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359);
    address cDaiAddr = address(0xF5DCe57282A584D2746FaF1593d3121Fcac444dC);
    uint256 public minLockAmount = 1000 ether;
    uint256 public blockWait = 1000;

    address public owner;
    address public nftAddr;

    struct LockUp {
        uint256 amount;
        uint256 cDaiMinted;
        uint256 blockLocked;
    }

    mapping(address => LockUp) locks;
    uint256 cDaiOwed;

    constructor() public {
        owner = msg.sender;
    }

    // PUBLIC USER

    function approveCDai() public {
        IERC20 daiToken = IERC20(daiAddr);
        daiToken.approve(cDaiAddr, 1000000 ether);
    }

    function lockDai(uint256 amount) public {
        require(0 == locks[msg.sender].amount, "EXISTING_BALANCE");
        require(amount >= minLockAmount, "BELOW_MIN");

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
        locks[msg.sender].blockLocked = block.number;
    }

    function redeemDai() public {
        uint256 amountLocked = locks[msg.sender].amount;
        require(amountLocked > 0, "NO_BALANCE");

        ICERC20 cDai = ICERC20(cDaiAddr);
        require(0 == cDai.redeemUnderlying(amountLocked), "REDEEM_FAILURE");

        cDaiOwed = cDaiOwed - locks[msg.sender].cDaiMinted;

        IERC20 daiToken = IERC20(daiAddr);
        daiToken.transfer(msg.sender, amountLocked);

        uint256 blocksWaited = block.number - locks[msg.sender].blockLocked;

        if (blocksWaited > blockWait) {
            ILockNFT lockNFT = ILockNFT(nftAddr);
            lockNFT.mint(msg.sender);
        }

        delete locks[msg.sender];
    }

    // PUBLIC OWNER

    function setNFTAddr(address _nftAddr) public onlyOwner {
        nftAddr = _nftAddr;
    }

    function withdrawProfit(uint256 cDaiAmount) public onlyOwner {
        IERC20 cDaiToken = IERC20(cDaiAddr);
        uint256 cDaiBalance = cDaiToken.balanceOf(address(this));
        uint256 available = cDaiBalance - cDaiOwed;

        require(cDaiAmount <= available, "INSUFFICIENT_AVAILBLE");

        ICERC20 cDai = ICERC20(cDaiAddr);
        require(0 == cDai.redeem(cDaiAmount), "REDEEM_FAILURE");

        IERC20 daiToken = IERC20(daiAddr);
        uint256 daiBalance = daiToken.balanceOf(address(this));
        daiToken.transfer(owner, daiBalance);
    }

    // PUBLIC VIEW

    function contractBalances() public view returns (uint256 daiBalance, uint256 cDaiBalance, uint256 cDaiOutstanding) {
        IERC20 daiToken = IERC20(daiAddr);
        IERC20 cDaiToken = IERC20(cDaiAddr);

        return (
                daiToken.balanceOf(address(this)),
                cDaiToken.balanceOf(address(this)),
                cDaiOwed
               );
    }

    // MODIFIERS

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }
}