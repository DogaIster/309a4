$(document).ready(function(){

    $('#discussionBoard').click(function() {
	showDiscussionBoard();
    });

    $('#users').click(function() {
	showUsers();
    });

    $('#signIn').click(function() {
	showSignIn();
    });

    $('#signUp').click(function() {
	showSignUp();
    });

    $('#personalChat').click(function() {
	showPersonalChat();
    })
;
    $('#groupChat').click(function() {
	showGroupChat();
    });
 
});

var clearInfo = function()
{ 
    $('p').remove();
    $('#messageBoard').hide();	
    $('#fakeUsers').hide();
    $('#fakeSignIn').hide();
    $('#fakeSignUp').hide();
    $('#fakePersonalChat').hide();
    $('#fakeGroupChat').hide();
};

var showDiscussionBoard = function()
{
    clearInfo();
    $('#messageBoard').show();
};

var showUsers = function()
{
    clearInfo();
    $('#fakeUsers').show();
};

var showSignIn = function()
{
    clearInfo();
    $('#fakeSignIn').show();
};

var showSignUp = function()
{
    clearInfo();
    $('#fakeSignUp').show();
};

var showPersonalChat = function()
{
    clearInfo();
    $('#fakePersonalChat').show();
};

var showGroupChat = function()
{
    clearInfo();
    $('#fakeGroupChat').show();
};
