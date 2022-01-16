pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract newtoken is ERC20,Ownable{

    event usethebridge(address indexed user, string toaddress, uint256 amount);
    event tokenunlocked(address indexed user, uint256 indexed amount);
    address public bot;
    modifier onlyBot{
        require(msg.sender==bot);
        _;
    }
    
    IERC20 token;
    mapping(address=>uint256) public remaining;

    constructor(string memory name, string memory symbol,address _token) ERC20(name,symbol) {
        token = IERC20(_token);
    }

    function addnewbot(address _bot) external onlyOwner{
        bot = _bot;
    }

    function addlp(uint256 amount) external{
        token.transferFrom(msg.sender,address(this),amount);
        _mint(msg.sender, amount);
    }

    function removeLp(uint256 amount) external{
        uint256 balance= token.balanceOf(msg.sender);
        require(balance>=amount, "balance is less then amount");
        _burn(msg.sender,amount);
        token.transfer(msg.sender,amount);
    }

    function usebridge(uint256 amount,string memory reciever) external{
        token.transferFrom(msg.sender,address(this),amount);
        emit usethebridge(msg.sender, reciever, amount);
    }

    function unlocktoken(uint256 amount,address reciever) external onlyBot{
        uint256 addressbalance= token.balanceOf(address(this));
        if(addressbalance<amount){
            token.transfer(reciever,addressbalance);
            remaining[reciever]= amount-addressbalance;
            emit tokenunlocked(reciever,addressbalance);
        }else{
            token.transfer(reciever,amount);
            emit tokenunlocked(reciever,amount);
        }
        
    }
}