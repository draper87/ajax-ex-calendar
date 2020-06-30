$(document).ready(function() {

  // dichiaro le variabili con moment.js
  var dataDiPartenza = moment('2018-01-01');
  var meseNumero = dataDiPartenza.format('M');
  creaMese(dataDiPartenza); // richiamo la funzione che mi aggiorna il mese di competenza
  creaFestivita(meseNumero); // richiamo la funzione che fa la chiamata ajax e mi aggiorna le festivita

  // quando clicco su Mese precedente deve tornare indietro di un mese
  $('#precedente').click(function() {
    if (meseNumero == 1 ) {
      return;
    }
    dataDiPartenza.subtract(1 , 'month');
    meseNumero = dataDiPartenza.format('M');
    creaMese(dataDiPartenza);
    creaFestivita(meseNumero);
  })

  // quando clicco su Mese successivo deve andare avanti di un mese
  $('#successivo').click(function() {
    if (meseNumero == 12) {
      return;
    }
    dataDiPartenza.add(1 , 'month');
    meseNumero = dataDiPartenza.format('M');
    creaMese(dataDiPartenza);
    creaFestivita(meseNumero);
  })


  function creaMese(dataDiPartenza) {

    var mese = dataDiPartenza.format('MMMM');
    var anno = dataDiPartenza.format('YYYY');
    var numeroGiorniMese = dataDiPartenza.daysInMonth(); // utilizzo questa variabile per sapere il numero di giorni nel mese

    var source = $('#entry-template').html(); // questo e il path al nostro template html
    var template = Handlebars.compile(source); // passiamo a Handlebars il percorso del template html

    $('.container .giorni').html(''); // resetto la lista
    $('.container').children('h2').text(mese + ' ' + anno); // vado a scrivere il mese e anno di competenza
    for (var i = 1; i <= numeroGiorniMese; i++) { // utilizzo il ciclo for dove il limite e il numero dei gg nel mese specifico

      var giornoCorrente = moment({
        year: dataDiPartenza.year(),
        month: dataDiPartenza.month(),
        day: i
      });

      var context = {
        mese: mese,
        giorno: i,
        dataAttr: giornoCorrente.format('YYYY-MM-DD')
      };
      var html = template(context);
      $('.container .giorni').append(html);
    }
  }

  // funzione che fa una chiamata ajax e associa eventuali festivita al giorno corrispondente
  function creaFestivita(meseNumero) {
    $.ajax({
      url: 'https://flynn.boolean.careers/exercises/api/holidays',
      method: 'GET',
      data: {
        "year": 2018,
        "month": meseNumero - 1
      },
      success: function(data) {
        var festivita = data.response;

        for (var i = 0; i < festivita.length; i++) { // faccio un ciclo for per ciclare tutte le possibili festivita
          var singolaFestivita = festivita[i].date; // metto in una variabile il singolo oggetto della array
          var nomeFestivita = festivita[i].name; // prendo il nome della festivita

          $('.giorni li').each(function() { // ciclo per tutti i giorni presenti in lista
            var giornoAttuale = $(this).attr('dataAttr'); // prendo il valore dell attributo dataAttr dalla lista
            if (giornoAttuale == singolaFestivita) { // se combaciano allora faccio il match
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
