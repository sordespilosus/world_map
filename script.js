var title = '';
var popBlock = true;

$(document).ready(() => {

  $('#night').click(function(){
    $('body').css('background', 'radial-gradient(circle, rgba(43,34,105,1) 0%, rgba(2,0,59,1) 100%)');
    $('#contour').attr('filter', 'url(#sofGlow)');
  });

  $('#day').click(function(){
    $('body').css('background', 'radial-gradient(circle, rgba(160,160,160,1) 0%, rgba(207,207,207,1) 53%, rgba(220,220,220,1) 100%)');
    $('#contour').attr('filter', '');
  });

  $('#ru_lang').click(function(){
    $('path[title *= "eng"]').css('display', 'none');
    $('path[title *= "rus"]').css('display', 'block');
  });

  $('#en_lang').click(function(){
    $('path[title *= "rus"]').css('display', 'none');
    $('path[title *= "eng"]').css('display', 'block');
  });
  
  $('path[title *= "rus"]').css('display', 'none');

    $('#world_map path').click(function(e) { //при клике на любую страну
      title = $(this).attr('title');
      console.log(title);
      return title;
    });


  $('.send_button').click(function(e){ //при нажатии на кнопку "отправить" создаем объект с title каждой области и присвоенным ей цветом
    let result = $('path').map(function(idx,v){ 
          if ($(v).attr('title') == 'yellow' || $(v).attr('title') == 'brown' || $(v).attr('title') == 'blue') {
            return {
                [$(v).attr('title')]: $(v).attr('fill') 
              };
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
        $('path[title = ' + title + ']').attr('fill', color);
        title = '';
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
      if (title == 'yellow') {
        element.find('ul.color-reset li').attr('data-color', '#F9DAB4');
      } else if (title == 'brown') {
        element.find('ul.color-reset li').attr('data-color', '#9B5D39');
      } else {
        element.find('ul.color-reset li').attr('data-color', '#1A7394');
      }
      
      element.css({ 'top': top, 'left': left });
  }

  /*Event click*/
  $(this).mouseup(function (e) {
    if (!openChooseColor) {
      $.get("pickcolor/choose-color.html", function (data) {
        const $element = $(data);
        $('body').append($element);
        $('body').css('overflow', 'hidden');
        positionElement($element, e)
        if (popBlock == true){
          effectModal($element)
        }
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

  $('#world_map').mousemove(function(event){  
  var w = $("#Clip").width();
  var x = event.pageX - (w / 2);
  var y = event.pageY - (w / 2);
  $("#Clip").attr('transform', "translate("+x +","+ y +")");
  $("#search").attr('transform', "translate("+ (x) +","+ (y) +")");
  $('.hover-item').hover(function(){
      var i = $(this).data('index'); 
      $('.hover-item[data-index="'+ i +'"]').attr('class', 'hover-item active');
  });
  
  });
  $('.hover-item').click(function(){
      if($(this).hasClass('active')){
         alert("clicked");
      }
  });
}