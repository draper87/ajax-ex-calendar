moment.locale('en');

$(document).ready(function() {

  var dataDiPartenza = moment('2018-01-01');
  var giorno = dataDiPartenza.format('D');
  var mese = dataDiPartenza.format('MMMM');
  console.log(mese);
  var anno = dataDiPartenza.format('YYYY');
  var numeroGiorniMese = dataDiPartenza.daysInMonth();
  // console.log(giorno);
  // console.log(numeroGiorniMese);
  // console.log(mese);
  creaMese();

  $('#precedente').click(function() {
    if (mese === 'January' ) {
      return;
    }
    dataDiPartenza.subtract(1 , 'month');
    console.log(dataDiPartenza.format('D, MMMM'));
    numeroGiorniMese = dataDiPartenza.daysInMonth();
    giorno = dataDiPartenza.format('D');
    mese = dataDiPartenza.format('MMMM');
    anno = dataDiPartenza.format('YYYY');
    creaMese();
  })

  $('#successivo').click(function() {
    if (mese === 'December') {
      return;
    }
    dataDiPartenza.add(1 , 'month');
    console.log(dataDiPartenza.format('D, MMMM'));
    numeroGiorniMese = dataDiPartenza.daysInMonth();
    giorno = dataDiPartenza.format('D');
    mese = dataDiPartenza.format('MMMM');
    anno = dataDiPartenza.format('YYYY');
    creaMese();
  })


  function creaMese() {
    $('.container .calendario').html('');
    $('.container').children('h4').text(mese + ' ' + anno);
    for (var i = 0; i < numeroGiorniMese; i++) {

      var source = $('#entry-template').html(); // questo e il path al nostro template html
      var template = Handlebars.compile(source); // passiamo a Handlebars il percorso del template html

      var context = { mese: mese, giorno: giorno };
      var html = template(context);
      $('.container').append(html);
      giorno++;
    }
  }


})
