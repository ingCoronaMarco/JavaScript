if (typeof ava === "undefined") { ava = { __namespace: true }; }
if (typeof ava.richiestarimborso === "undefined") { ava.richiestarimborso = { __namespace: true }; }

ava.richiestarimborso.Ribbon = new function () {

    this.sendInvoice = function (formContext) {
        try {
            // Imposta lo stato solo se necessario
            var statoInviata = 915240003;
            setStatoRichiesta(formContext, statoInviata);

            // Mostra alert, poi salva se ci sono modifiche
            showAlertDialog("La fattura è stata approvata. Fattura inviata.")
                .then(function () { //dopo esegue le seguenti operazioni sottostanti
                    if (formContext.data.getIsDirty()) { //Controlla se ci sono modifiche non salvate nel modulo utilizzando il metodo getIsDirty().
                        return formContext.data.save();  //Se ci sono modifiche, salva il record chiamando il metodo save() su formContext.data.
                    } else {
                        console.log("Nessuna modifica da salvare.");
                        return Promise.resolve(); //Restituisce una promessa risolta per mantenere la catena di promesse coerente, anche se non c'è nulla da salvare.
                        //Se non ci sono modifiche da salvare garantisce che la catena continui a funzionare
                        //Utilizzato per .then() per non interrompere il flusso, funziona come placeHolder
                    }
                })  //Then lo posso usare solo se la funzione restituisce una promise 
                .then(function () { //Dopo che l'utente ha chiuso il dialogo di avviso, esegue la funzione successiva all'interno del metodo then.
                    console.log("Operazione completata."); //Si possono usare molteplici .then per eseguire piu' funzioni in successione e rendere il programma modulare
                })
              /* Posso aggiungere altre funzioni
              .then(function () { //Dopo che l'utente ha chiuso il dialogo di avviso, esegue la funzione successiva all'interno del metodo then.
                    console.log("Operazione completata."); //Si possono usare molteplici .then per eseguire piu' funzioni in successione e rendere il programma modulare
                })
              */
                .catch(function (err) {
                    console.error("Errore: " + err.message);
                });
        } catch (e) {
            console.error("Errore nella funzione sendInvoice: " + e.message);
        }
    };

    function setStatoRichiesta(formContext, value) { //dobbiamo passare sempre il formContext e il valore se vogliamo settare un campo
        const campo = formContext.getAttribute("ava_statodocumento");
        if (campo) {
            const currentValue = campo.getValue();//prende il valore dal campo "ava_documento"
            if (currentValue !== value) {
                campo.setValue(value); //setta il valore in argomento
            } else {
                console.log("Il valore è già impostato, nessuna modifica necessaria.");
            }
        } else {
            console.warn("Campo 'ava_statodocumento' non trovato sul modulo.");
        }
    }

    function showAlertDialog(message) {
        const alertStrings = { text: message, confirmButtonLabel: "OK" };
        const alertOptions = { height: 120, width: 260 };
        return Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
    }
};
