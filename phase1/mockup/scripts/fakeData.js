$(document).ready(function(){

    $('#discussionBoard').click(function() {
	showDiscussionBoard();
    });
 
});

var clearInfo = function()
{ 
    $('p').remove();
};

var showDiscussionBoard = function()
{
    clearInfo();
    $('#messageBoard').show();
};
