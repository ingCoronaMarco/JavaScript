// Definizione dei namespace
if (typeof (ava) == "undefined") { ava = {}; }
if (typeof (ava.encyclopedia) == "undefined") { ava.encyclopedia = {}; }

// Form con logica di validazione
ava.encyclopedia.Form = new function (){

  var formContext = null;
  var globalContext = null;
  var _self = this;

  var setContext = function (executionContext){
    if (executionContext !== null){
      formContext = executionContext.getFromContext(); //Contesto del form
    }
    globalContext = Xrm.Utility.getGlobalContext();
  };

  //Funzione che nasconde il campo
  function hideField(field) {
    form.Context.getControl(field).setVisible(false);
  }
  //Funzione che mostra il campo
  function showField(field){
    form.Context.getControl(field).setVisible(true);
  }


  //funzione che mostra/nasconde dei campi in seguito alla scelta di un valore
  //option set selezionabile dall'utente
    function statusType(typeEncyclopedia) {
     
        let choice = 915240001; // ✅ Valore numerico dell'OptionSet per "Commercial"

        //  Estrarre il valore dall'array se presente
        let selectedValue = typeEncyclopedia ? typeEncyclopedia[0] : null;

        if (selectedValue === choice) {
            hideField("ava_dateto");
            hideField("ava_datefrom");
        } else {
            showField("ava_dateto");
            showField("ava_datefrom");
        }
    }
    // ava.encyclopedia.Form.OnLoad -> funzione passata 
    _self.OnLoad = function (executionContext) {
        setContext(executionContext);
         //Legge il valore del campo acquisito
        let typeEncValue = formContext.getAttribute("ava_type").getValue();

        if (typeEncValue !== null && typeEncValue.length > 0) {
            statusType(typeEncValue);
        } else {
            console.log("⚠ Il campo ava_type è vuoto, nessuna azione eseguita.");
        }
    };
    
}
