$(document).ready(function(){

	'use strict';

	var handle = document.getElementById('handle');
	var slider = document.getElementById('scrollBar');
	var sliderWrapp = document.getElementById('sliderGallery');
	var container = document.getElementById('container');

	if(handle && slider && container){

	var position,           // ïîòî÷íàÿ ïîçèöèÿ ïîëçóíêà
		startMargin,        // íà÷àëüíàÿ ïîçèöèÿ ïîëçóíêà ïåðåä ñäâèãîì
		maxMargin,          // ìàêñèìàëüíàÿ äèñòàíöèÿ äëÿ ïðîõîäà ïîëçóíêà
		itemsWidth,         // ìàêñèìàëüíàÿ äëèíà äëÿ ñäâèãà êîíòåíòà
		isFilter = false,   // ôëàæîê, ïîêàçûâàþùèé âèäèìû ëè ÷åêáîêñû
		isIPad = false;

	window.onresize = function(){

		//console.log('resize');
		init();
	}

	window.onload = function(){
		init();
	}

	// event for PC

	handle.addEventListener('mousedown', function(event){

		position = event.pageX;
		startMargin = parseFloat(handle.style.marginLeft);

		preventSelection(sliderWrapp);
	});


	slider.addEventListener('click', function(event){

		var newCoords = event.pageX - slider.offsetLeft;

		if(newCoords > parseFloat(handle.style.marginLeft) && newCoords < parseFloat(handle.style.marginLeft) + handle.offsetWidth){
			console.log('inside handle');
		}
		else{
			newCoords -= (handle.offsetWidth / 2);

			if(newCoords > parseFloat(handle.style.marginLeft))
				newCoords = parseFloat(handle.style.marginLeft) + (maxMargin / 15);
			else
				newCoords = parseFloat(handle.style.marginLeft) - (maxMargin / 15);

			move(newCoords);
		}
	});

	document.addEventListener('mousemove', function(event){

		if(position){
			var newCoords = (startMargin + (event.pageX - position));
			move(newCoords);
		}


	});

	document.addEventListener('mouseup', function(){
		position = null;

	});
	var right = document.getElementById('arrowRight');
	if(right){
		right.addEventListener('click', function(){

			var newCoords = parseFloat(handle.style.marginLeft) + (maxMargin / 15);
			move(newCoords);
		});
	}
	var left = document.getElementById('arrowLeft');
	if(left){
		left.addEventListener('click', function(){

			var newCoords = parseFloat(handle.style.marginLeft) - (maxMargin / 15);
			move(newCoords);
		});
	}

	// event for iPad

	handle.addEventListener('touchstart', function(event){

		event.preventDefault();
		var touch = event.touches[0];
		position = touch.pageX;
		startMargin = parseFloat(handle.style.marginLeft);
		doTouch(event);

	}, false);

	document.addEventListener('touchmove', function(event){

		if(position){

			event.preventDefault();
			var touch = event.touches[0];

			var newCoords = (startMargin + (touch.pageX - position));
			move(newCoords);
		}

		doTouch(event);
		preventSelection(sliderWrapp);

	}, false);

	document.addEventListener('touchend', function(e){

		position = null;
		//alert('touchend');
		//move(position);
		doTouch(e);

	}, false);
	}

	function move(newCoords){
		if(newCoords <= 0){
			newCoords = 0;
		}

		if(newCoords >= maxMargin){
			newCoords = maxMargin;
		}

		handle.style.marginLeft = newCoords + 'px';
		container.style.left = -((newCoords / maxMargin) * itemsWidth) + 'px';

		//handle.style.webkitTransform = 'translateX(' + (event.pageX - position) + 'px)';
		//handle.style.transform = 'translateX(' + (event.pageX - position) + 'px)';
	}

	function init(){

		if(navigator.userAgent.match(/iPad/i) == 'iPad'){

			isIPad = true;
		}
		else{
			isIPad = false;

			// Ñäåëàòü ïîëóïðîçðà÷íûìè âñå òîâàðû êðîìå âûäåëåíîãî
			jQuery('.product').hover(
				function(){
					jQuery('.slider-image').css("opacity", 0.6);
					jQuery(this).children('img').css("opacity", 1);
					//$('#arrowRight,#arrowLeft').fadeIn();
				},
				function(){
					jQuery('.slider-image').css("opacity", 1);
					//$('#arrowRight,#arrowLeft').fadeOut();
				});
		}

		// Åñëè øèðèíà êîíòåíòà íå ïðåâûøàåò øèðèíó åêðàíà, òî óáðàòü ïîëîñó ïðîêðóòêè è ðàçìåñòèòü êîíòåíò ïî öåíòðó
		if(Math.abs($('#container').innerWidth()) > screen.width){

		}

		else{
			$('#sliderGallery').hover(

				function(){
					$('#arrowLeft').css("top", ($('#sliderGallery').height() / 2) - ($('#arrowLeft').height() / 2));
					$('#arrowRight').css("top", ($('#sliderGallery').height() / 2) - ($('#arrowRight').height() / 2));

					$('.arrow-left, .arrow-right').fadeIn();
				},

				function(){

					$('.arrow-left, .arrow-right').fadeOut();
				}
			);
		}

		if(isIPad){

			$('#arrowLeft').css("top", ($('#sliderGallery').height() / 2) - ($('#arrowLeft').height() / 2));
			$('#arrowRight').css("top", ($('#sliderGallery').height() / 2) - ($('#arrowRight').height() / 2));

			$('.arrow-left').css('display', 'block');
			$('.arrow-right').css('display', 'block');

		}

		itemsWidth = container.offsetWidth - sliderWrapp.offsetWidth + $('#arrowRight').width(); // äëèííà êîíòåíòà äëÿ ïðîêðóòêè
		//$('#scrollBar').css('margin-top', $('#container').height() + 20);      // äèíàìè÷åñêè âû÷èñëÿåìûé ìàðäæèí
		handle.style.marginLeft = '0px';//some comment
		//handle.style.width = 100 * (window.innerWidth / container.offsetWidth) + '%';     // âû÷èñëÿþ äëèíó ïîëçóíêà
		maxMargin = slider.offsetWidth - handle.offsetWidth;        // ìàêñèìàëüíîå ðàññòîÿíèå êîòîðîå ìîæåò ïðîéòè ïîëçóíîê

	}

	function preventSelection(element){
		var preventSelection = false;

		function addHandler(element, event, handler){
			if(element.attachEvent)
				element.attachEvent('on' + event, handler);
			else if(element.addEventListener)
				element.addEventListener(event, handler, false);
		}

		function removeSelection(){
			if(window.getSelection){
				window.getSelection().removeAllRanges();
			}
			else if(document.selection && document.selection.clear)
				document.selection.clear();
		}

		// íå äàåì âûäåëÿòü òåêñò ìûøêîé
		addHandler(element, 'mousemove', function(){
			if(preventSelection)
				removeSelection();
		});
		addHandler(element, 'mousedown', function(event){
			var event = event || window.event;
			var sender = event.target || event.srcElement;
			preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
		});

		// áîðåì dblclick
		// åñëè âåøàòü ôóíêöèþ íå íà ñîáûòèå dblclick, ìîæíî èçáåæàòü
		// âðåìåííîå âûäåëåíèå òåêñòà â íåêîòîðûõ áðàóçåðàõ
		addHandler(element, 'mouseup', function(){
			if(preventSelection)
				removeSelection();
			preventSelection = false;
		});

	}


});