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
    });

    $('#groupChat').click(function() {
	showGroupChat();
    });

    $('#bookOfficeHour').click(function() {
	showBookOfficeHour();
    });
 
    $('#requestOfficeHour').click(function() {
	showRequestOfficeHour();
    });
 

    $('#offerOfficeHour').click(function() {
	showOfferOfficeHour();
    });
 
    $('#bookGroupOfficeHour').click(function() {
	showBookGroupOfficeHour();
    });
 
    $('#listBookedOfficeHours').click(function() {
	showListBookedOfficeHours();
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
    $('#fakeBookOfficeHour').hide();
    $('#fakeRequestOfficeHour').hide();
    $('#fakeBookOfficeHour').hide();
    $('#fakeOfferOfficeHour').hide();
    $('#fakeBookGroupOfficeHour').hide();
    $('#listBookedOfficeHours').hide();
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

var showBookOfficeHour = function()
{
    clearInfo();
    $('#fakeBookOfficeHour').show();
};

var showRequestOfficeHour = function()
{
    clearInfo();
    $('#fakeRequestOfficeHour').show();
};

var showOfferOfficeHour = function()
{
    clearInfo();
    $('#fakeOfferOfficeHour').show();
};

var showBookGroupOfficeHour = function()
{
    clearInfo();
    $('#fakeBookGroupOfficeHour').show();
};

var showListBookedOfficeHours = function()
{
    clearInfo();
    $('#listBookedOfficeHours').show();
};
