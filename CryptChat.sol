pragma solidity ^0.4.23; 

contract CryptChat {
    struct Post {
        uint time;
        address addr;
        string text;
    }
    Post[] public posts;
    
    event Write(uint _time, address _address, string _text);

    function getPostsLength() public view returns(uint) {
        return posts.length;
    }
    function getTime(uint _id) public view returns(uint) {
        if(posts.length <= _id){
            return 0;
        }
        return posts[_id].time;
    }
    function getAddr(uint _id) public view returns(address) {
        if(posts.length <= _id){
            return address(0);
        }
        return posts[_id].addr;
    }
    function getText(uint _id) public view returns(string) {
        if(posts.length <= _id){
            return "";
        }
        return posts[_id].text;
    }
    function set(string _text) public { 
        posts.push(Post(
            now,        // uint time
            msg.sender, // address addr
            _text       // string text
        ));
    
        emit Write(now, msg.sender, _text);
    }
}