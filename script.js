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
    creaMese(dataDiPartenza, meseNumero);
  })

  // quando clicco su Mese successivo deve andare avanti di un mese
  $('#successivo').click(function() {
    if (meseNumero == 12) {
      return;
    }
    dataDiPartenza.add(1 , 'month');
    meseNumero = dataDiPartenza.format('M');
    creaMese(dataDiPartenza, meseNumero);
  })


  function creaMese(dataDiPartenza, meseNumero) {

    var mese = dataDiPartenza.format('MMMM');
    var anno = dataDiPartenza.format('YYYY');
    var numeroGiorniMese = dataDiPartenza.daysInMonth(); // utilizzo questa variabile per sapere il numero di giorni nel mese

    var source = $('#entry-template').html(); // questo e il path al nostro template html
    var template = Handlebars.compile(source); // passiamo a Handlebars il percorso del template html

    $('.container .giorni').html(''); // resetto la lista
    $('.container').children('h4').text(mese + ' ' + anno); // vado a scrivere il mese e anno di competenza
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

    // metterla dentro un altra funzione
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

          for (var i = 0; i < festivita.length; i++) {
            var singolaFestivita = festivita[i].date; // metto in una variabile il singolo oggetto della array
            var nomeFestivita = festivita[i].name; // prendo il nome della festivita
            var singolaFestivitaGiorno = parseInt(singolaFestivita.substr(singolaFestivita.length - 2)); // mi estraggo il giorno della festivita per poterlo confrontare con quello della mia lista

            $('.giorni li').each(function() { // ciclo per tutti i giorni presenti in lista
              var giornoAttuale = parseInt($(this).children('.giorno').text());
              if (giornoAttuale == singolaFestivitaGiorno) { // se combaciano allora faccio il match
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
