function rot13(str) {
  var input     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var output    = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
  var index     = x => input.indexOf(x);
  var translate = x => index(x) > -1 ? output[index(x)] : x;
  return str.split('').map(translate).join('');
}

$(() => {

  var exampleCallback = function() {
    console.log("Order complete!");
  };

  window.EBWidgets.createWidget({
    widgetType: "checkout",
    eventId: "103977166504",
    modal: true,
    modalTriggerElementId: "example-widget-trigger",
    onOrderComplete: exampleCallback
  });

  $('.translatable').each(function(i, el) {
    let $this = $(this);
    let oldText = $this.text();
    let newText = rot13(oldText);
    $this.attr('aria-label', oldText)
    $this.text('');
    newText.split('').map(letter => {
      $this.append(`<span class="untranslated">${letter}</span>`)
    });
  });

  $('.flyer').show();

  setTimeout(moreTransitions, 1000);
});

let numToTranslate = 10;
const transitionFunctions = [
  blurTransition,
  glitchTransition
];
function moreTransitions(){
  console.log('MOAR', numToTranslate);
  let untranslated = _.shuffle(document.querySelectorAll('.untranslated'))
  let nextLetters = untranslated.slice(0,numToTranslate);

  nextLetters.map(letterEl => {
    let func = _.sample(transitionFunctions);
    requestAnimationFrame(() => func(letterEl));
  });

  numToTranslate = Math.ceil(numToTranslate*(1+Math.random()));
  if(untranslated.length){
    setTimeout(moreTransitions, 250);
  } else {
    console.log('DONE!');
  }
}

function blurTransition(el) {
  let $el = $(el);
  $el.css({
    'font-family': '"Galactico"',
    'font-size': window.innerWidth <= 1024 ? '0.67em': '',
    '-webkit-filter': 'blur(20px)',
    'filter': 'blur(20px)'
  });
  $el.removeClass('untranslated');

  setTimeout(() => {
    requestAnimationFrame(() => {
      $el.css({
        'font-family': '',
        'font-size': '',
      });

      setTimeout(() => {
        requestAnimationFrame(() => {
          $el.text(rot13($el.text()));

          setTimeout(() => {
            requestAnimationFrame(() => {
              $el.css({
                '-webkit-filter': '',
                'filter': ''
              });
            })
          }, Math.random()*300);
        })
      }, Math.random()*300);
    });
  }, Math.random()*300);
}

function glitchTransition(el) {
  let $el = $(el);
  let sign = Math.pow(-1, Math.round(Math.random()));
  $el.css({
    'font-family': '"Galactico"',
    'font-size': window.innerWidth <= 1024 ? '0.67em': '',
    'display':'inline-block',
    'transform': `translateY(${sign*Math.random()*30}px)`
  });
  $el.removeClass('untranslated');

  setTimeout(() => {
    requestAnimationFrame(() => {
      $el.css({
        'font-family': '',
        'font-size': '',
        'transform': `translateY(${-sign*Math.random()*30}px)`
      });


      setTimeout(() => {
        requestAnimationFrame(() => {
          $el.css({
            'transform': `translateY(${sign*Math.random()*30}px)`
          });

          setTimeout(() => {
            requestAnimationFrame(() => {
              $el.css({
                'transform': `translateY(${-sign*Math.random()*30}px)`
              });
              $el.text(rot13($el.text()));


              setTimeout(() => {
                requestAnimationFrame(() => {
                  $el.css({
                    'transform': `translateY(${sign*Math.random()*30}px)`
                  });

                  setTimeout(() => {
                    requestAnimationFrame(() => {
                      $el.css({
                        'display':'',
                        'transform':''
                      });
                    })
                  }, Math.random()*200);
                })
              }, Math.random()*400);
            })
          }, Math.random()*100);
        })
      }, Math.random()*100);
    });
  }, Math.random()*200);
}