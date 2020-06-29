$(document).ready(function() {

  // dichiaro le variabili con moment.js
  var dataDiPartenza = moment('2018-01-01');
  var giorno = dataDiPartenza.format('D');
  var mese = dataDiPartenza.format('MMMM');
  var meseNumero = dataDiPartenza.format('M');
  var anno = dataDiPartenza.format('YYYY');
  var numeroGiorniMese = dataDiPartenza.daysInMonth(); // utilizzo questa variabile per sapere il numero di giorni nel mese
  creaMese(); // richiamo la funzione che mi aggiorna il mese di competenza e fa la chiamata ajax per trovare le festivita

  // quando clicco su Mese precedente deve tornare indietro di un mese
  $('#precedente').click(function() {
    if (meseNumero == 1 ) {
      return;
    }
    dataDiPartenza.subtract(1 , 'month');
    numeroGiorniMese = dataDiPartenza.daysInMonth();
    giorno = dataDiPartenza.format('D');
    mese = dataDiPartenza.format('MMMM');
    meseNumero = dataDiPartenza.format('M');
    anno = dataDiPartenza.format('YYYY');
    creaMese();
  })

  // quando clicco su Mese successivo deve andare avanti di un mese
  $('#successivo').click(function() {
    if (meseNumero == 12) {
      return;
    }
    dataDiPartenza.add(1 , 'month');
    numeroGiorniMese = dataDiPartenza.daysInMonth();
    giorno = dataDiPartenza.format('D');
    mese = dataDiPartenza.format('MMMM');
    meseNumero = dataDiPartenza.format('M');
    anno = dataDiPartenza.format('YYYY');
    creaMese();
  })


  function creaMese() {
    $('.container .giorni').html(''); // resetto la lista
    $('.container').children('h4').text(mese + ' ' + anno); // vado a scrivere il mese e anno di competenza
    for (var i = 0; i < numeroGiorniMese; i++) { // utilizzo il ciclo for dove il limite e il numero dei gg nel mese specifico

      var source = $('#entry-template').html(); // questo e il path al nostro template html
      var template = Handlebars.compile(source); // passiamo a Handlebars il percorso del template html

      var context = { mese: mese, giorno: giorno };
      var html = template(context);
      $('.container .giorni').append(html);
      giorno++; // uso un contatore per fare in modo che la lista dei giorni aumenti
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
