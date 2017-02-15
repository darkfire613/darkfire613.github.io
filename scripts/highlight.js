var words = ['house','familiar'];

function colorWords(){
  var maintext = document.getElementById('text');
  var text = maintext.innerHTML;
  words.forEach(function(item, index, array){
    console.log(item);
    var regexp = new RegExp('('+item+')', 'ig');
    var newSpan = "<span class='"+item+"'>$1</span>"
    text = text.replace(regexp, newSpan);
    maintext.innerHTML = text;
  });
}

window.onload = colorWords();
