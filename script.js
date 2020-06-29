moment.locale('en');

$(document).ready(function() {

  var dataDiPartenza = moment('2018-01-01');
  var giorno = dataDiPartenza.format('D');
  var mese = dataDiPartenza.format('MMMM');
  var meseNumero = dataDiPartenza.format('M');
  console.log(meseNumero);
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
    meseNumero = dataDiPartenza.format('M');
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
    meseNumero = dataDiPartenza.format('M');
    anno = dataDiPartenza.format('YYYY');
    creaMese();
  })


  function creaMese() {
    $('.container .giorni').html('');
    $('.container').children('h4').text(mese + ' ' + anno);
    for (var i = 0; i < numeroGiorniMese; i++) {

      var source = $('#entry-template').html(); // questo e il path al nostro template html
      var template = Handlebars.compile(source); // passiamo a Handlebars il percorso del template html

      var context = { mese: mese, giorno: giorno };
      var html = template(context);
      $('.container .giorni').append(html);
      giorno++;
    }

    $.ajax({
      url: 'https://flynn.boolean.careers/exercises/api/holidays',
      method: 'GET',
      data: {
        "year": 2018,
        "month": meseNumero - 1
      },
      success: function(data) {
        var festivita = data.response;
        var dataDaControllare = festivita[0].date;

        for (var i = 0; i < festivita.length; i++) {
          var singolaFestivita = festivita[i].date; // metto in una variabile il singolo oggetto della array
          var nomeFestivita = festivita[i].name;
          var singolaFestivitaGiorno = parseInt(singolaFestivita.substr(singolaFestivita.length - 2));
          $('.giorni li').each(function() {
            var giornoAttuale = parseInt($(this).children('.giorno').text());
            if (giornoAttuale == singolaFestivitaGiorno) {
              $(this).find('.festivo').append(' - ' + nomeFestivita);
              $(this).addClass('evidenziato');
            }
          })
        }
      },
      error: function() {
        alert('errore server');
      }
    })
  }


})
