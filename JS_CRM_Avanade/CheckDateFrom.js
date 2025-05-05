// Definizione dei namespace
if (typeof (ava) == "undefined") { ava = { __namespace: true }; }
if (typeof (ava.encyclopedia) == "undefined") { ava.encyclopedia = { __namespace: true }; }

// Form contiene tutta la logica
ava.encyclopedia.Form = new function () {

  var formContext = null;
  var globalContext = null;
  var _self = this;

   var setContext = function (executionContext) {
      if (executionContext !== null) {
          formContext = executionContext.getFormContext(); // Contesto del form
      }
      globalContext = Xrm.Utility.getGlobalContext();
  };

  //Funzione che verifica una data 
  function ValueFieldControl(executionContext){
    setContext(executionContext);

    //Prendo i valori dai rispettivi campi
    let valueDateTo = formContext.getAttribute("ava_dateto").getValue();
    let valueDateFrom = formContext.getAttribute("ava_datefrom").getValue();

    if (!valueDateTo || !valueDateFrom) return ;

         // Se la data di inizio è maggiore della data di fine, mostro l'alert
     if (valueDateFrom > valueDateTo) {
         Xrm.Navigation.openAlertDialog({ text: "La data di inizio deve essere minore o uguale alla data di fine." });
         return;
     }
        
  }


     _self.OnLoad = function (executionContext) {  //Funzione 
       setContext(executionContext); // Imposta il contesto 

       let dateFromAttr = formContext.getAttribute("ava_datefrom"); //Acquisisce il valore del campo

       if (dateFromAttr) dateFromAttr.addOnChange(ValueField); //la funzione si attiva a ogni cambiamento di valore del campo
   };








    
  };
