class HorizontalImageViewer {
	constructor(_fileViewerDiv){
		var _this = this;

		this.fileViewerDiv = _fileViewerDiv;
		$(this.fileViewerDiv).addClass("fileViewer").attr("tabindex","0");
		//fileDisplay
		this.fileDisplay = $(this.fileViewerDiv).append("<div>").children().last()[0];
		$(this.fileDisplay).addClass("fileDisplay");
		//left and right arrow
		this.leftArrow = $(this.fileViewerDiv).append("<div>").children().last()[0];
		$(this.leftArrow).addClass("leftArrow").text("<");
		$(this.leftArrow).click(function(){
			_this.scrollPrev();
		});

		this.rightArrow = $(this.fileViewerDiv).append("<div>").children().last()[0];
		$(this.rightArrow).addClass("rightArrow").text(">");
		$(this.rightArrow).click(function(){
			_this.scrollNext();
		});



		//scroller
		this.scrollDiv = $(this.fileViewerDiv).append("<div>").children().last()[0];
		$(this.scrollDiv).addClass("scroller");


		//closer
		this.closer = $(this.fileViewerDiv).append("<div>").children().last()[0];
		$(this.closer).addClass("closer");
		$(this.closer).text("X");
		$(this.closer).click(function(){
			_this.hide();
		});

		//Listen keys
		$(this.fileViewerDiv).keydown(function(e) {
		    switch(e.which) {
		        case 37: // left
		        _this.scrollPrev();
		        break;
		        case 39: // right
		        _this.scrollNext();
		        break;
		        case 27: //ESC
		        _this.hide();
		        default: return; // exit this handler for other keys
		    }
		    e.preventDefault(); // prevent the default action (scroll / move caret)
		});

		//swipe listener
		this.swipeListener();
	}
	display(id){
		if($(id).children().prop("tagName") == "IMG"){
			$(this.fileDisplay).html('<img src="' + $(id).children().attr("src") + '"/>');
		}
		else if($(id).children().prop("tagName") == "VIDEO"){
			console.log("video");
		}
	}
	scroll(id){
		$(this.scrollDiv).find(".active").removeClass("active");
		this.display(id);
		$(id).children().addClass("active");
		$(this.scrollDiv).stop().animate({scrollLeft:$(id)[0].offsetLeft - $(this.scrollDiv).width()/2}, 500, 'swing');
	}
 	scrollNext(){
		if($(this.scrollDiv).find(".active").length > 0)
 			$(this.scrollDiv).find(".active").parent().next().click();
 		else
 			$(this.scrollDiv).find("img")[0].click();
 	}
	scrollPrev(){
		if($(this.scrollDiv).find(".active").length > 0)
 			$(this.scrollDiv).find(".active").parent().prev().click();
 		else
 			$(this.scrollDiv).find("img")[0].click();

	}
	addFile(_src){
		$(this.scrollDiv).append('<div style="margin: 0 5px; height: 50px; width: 50px;"><img src="' + _src + '" style="width: 100%; height: 50px;"/><span>x</span></div>');
	 	var _this = this;
		$(this.scrollDiv).children().last().click(function(){
			_this.scroll(this);
		}); 
		$(this.scrollDiv).children().last().children().last().click(function(){
			_this.removeFile(this);
		}); 
	}
	swipeListener(){
		  var container = this.fileDisplay;
		  container.addEventListener("touchstart", startTouch, false);
		  container.addEventListener("touchmove", moveTouch, false);
		  // Swipe Up / Down / Left / Right
		  var initialX = null;
		  var initialY = null;
		  function startTouch(e) {
		    initialX = e.touches[0].clientX;
		    initialY = e.touches[0].clientY;
		  };

		  var _this = this;
		  function moveTouch(e) {
		    if (initialX === null) {
		      return;
		    }
		    if (initialY === null) {
		      return;
		    }
		    var currentX = e.touches[0].clientX;
		    var currentY = e.touches[0].clientY;
		    var diffX = initialX - currentX;
		    var diffY = initialY - currentY;
		    if (Math.abs(diffX) > Math.abs(diffY)) {
		      // sliding horizontally
		      if (diffX > 0) {
		        // swiped left
		        _this.scrollNext();
		        console.log("swiped left");
		      } else {
		        // swiped right
		        console.log("swiped right");
		        _this.scrollPrev();
		      }  
		    }
		    /* else {
		      // sliding vertically
		      if (diffY > 0) {
		        // swiped up
		      } else {
		        // swiped down
		        console.log("swiped down");
		      }  
		    }
		    */
		    initialX = null;
		    initialY = null;
		    e.preventDefault();
		  };
	}
	clearDisplay(){
		$(this.fileDisplay).html('');
	}
	removeFile(_id){
		if($(_id).hasClass("active")){
			if($(this.scrollDiv).children().length == 1)
				this.clearDisplay();
			else if($(_id).parent().index() == $(this.scrollDiv).children().length - 1)
				this.scrollPrev();
			else
				this.scrollNext();
		}
		$(_id).parent().remove();
	}
	show(){
		$(this.fileViewerDiv).show();
		$(this.fileViewerDiv).focus();
	}
	hide(){
		$(this.fileViewerDiv).hide();
	}
}