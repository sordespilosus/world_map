var poly;
var country;


$(document).ready(() => {
  let $offset

  $('#night').click(function(){
    $('body').css('background', 'radial-gradient(circle, rgba(43,34,105,1) 0%, rgba(2,0,59,1) 100%)');
    $('#contour').attr('filter', 'url(#sofGlow)');
  });

  $('#day').click(function(){
    $('body').css('background', 'radial-gradient(circle, rgba(230,230,230,1) 0%, rgba(255,255,255,1) 100%)');
    $('#contour').attr('filter', '');
  });

	$('path').attr('fill', '#ffffff'); //устанаваливаем цвет для полигонов, через css это сделать нельзя

	$('#world_map_countries path').hover(
		function(){
			$(this).attr('filter', 'url(#innershadow)');
      country = $(this).attr('title');
      $offset = $(this).offset();
      $('.country_label').html('<span>' + country + '</span>').css({'display': 'block', 'top': $offset.top, 'left': $offset.left - $('.country_label').width()  });
      console.log(country);
      return;
		},

		function(){
			if(!$(this).hasClass('shadowed')) {
				$(this).attr('filter', '');
        country = '';
        $('.country_label').css('display', 'none');
			}
      return;
		}
	);

	$('.shadowed').mouseout(
		function(){
			$(this).attr('filter', '');
		}
	)

    $('#world_map_countries path').click(function(e) { //при клике на любую страну
		let offset = $(this).offset(); //создаем переменную offset
		poly = $(this).attr('id'); //наполняем глобальную переменную poly
		$(this).attr('filter', 'url(#innershadow)').addClass('shadowed');
	 	return poly;
	});


	$('.send_button').click(function(e){ //при нажатии на кнопку "отправить" создаем объект с ID каждой страны и присвоенным ей цветом
		let result = $('path').map(function(idx,v){ 
            return { 
                [$(v).attr('id')]: $(v).attr('fill') 
            };
        }).get();
        let json =  JSON.stringify(result);      
		console.log(json);
	});


	$.support.cors = true; //задаем установки для colorpicker
	const $button = $('path')
	const $colorValue = $('.colorValue')
	$($button).sbxColorChoice({
		selecionarCor: (color) => {
	    	$($colorValue).val(color);
	    	$('#' + poly).attr('fill', color);
	  	},
	})
});

// Init a component
$.fn.sbxColorChoice = function (params) {

  const { reseteCor, removePallet, textResetColorButton, selecionarCor } = params
  let openChooseColor = false;
  let top, left

  //Function that close the component
  const closeChooseColor = (element) => {
    $('body').css('overflow', 'auto');
    element.slideUp('fast', function () {
      element.remove();
      openChooseColor = false;
    });
    console.log(poly);
    $('#' + poly).removeClass('shadowed').attr('filter', '');
  }

  // Function that apply the color selected
  const chooseColor = (element, e) => {
    element.find('ul li').click(function () {
      const color = $(this).attr('data-color');
      closeChooseColor(element);
      selecionarCor(color, e);
    });
  }

  // Function that reset color
  const removePalletColor = () => {
    if (removePallet != '' && removePallet != undefined) {
      $('body').find(removePallet).remove();
    }
  }

  // Function that add a custom text in reset color button
  const constumResetTextButton = (element) => {
    if (textResetColorButton) {
      element.find(".reset-color-button").html(textResetColorButton);
    }
  }

  // Function that create modal's effect
  const effectModal = (element) => {
    element.slideDown('fast', function () {
      element.focus();
    });
  }

  // Function that mark where the pallet will open
    const positionElement = (element, e) => {
      element.find('ul.color-reset li').attr('data-color', '#ffffff');
      element.css({ 'top': top, 'left': left });
  }

  /*Event click*/
  $(this).click(function (e) {
    if (!openChooseColor) {
      $.get("pickcolor/choose-color.html", function (data) {
        const $element = $(data);
        $('body').append($element);
        $('body').css('overflow', 'hidden');
        positionElement($element, e)
        effectModal($element)
        chooseColor($element, e)
        removePalletColor()
        constumResetTextButton($element)
        $element.focusout(() => closeChooseColor($element));
        openChooseColor = true;
      });
    }
    left = e.pageX;
    top = e.pageY;
  });
}