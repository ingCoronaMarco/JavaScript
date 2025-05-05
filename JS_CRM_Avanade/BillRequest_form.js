// Definizione dei namespace
if (typeof (ava) == "undefined") { ava = { __namespace: true }; }
if (typeof (ava.encyclopedia) == "undefined") { ava.encyclopedia = { __namespace: true }; }

// Form contiene tutta la logica
ava.richiestarimborso.Form = new function () {


    var formContext = null;
    var globalContext = null;
    var _self = this;

    var setContext = function (executionContext) {
        if (executionContext !== null) {
            formContext = executionContext.getFormContext(); // Contesto del form
        }
        globalContext = Xrm.Utility.getGlobalContext();
    };

    function hideField(field) {
        formContext.getControl(field).setVisible(false);
    }

    function disableField(field) {
        formContext.getControl(field).setDisabled(true);
    }

    _self.OnLoad = function (executionContext) {


        setContext(executionContext);

        var avaCodeField = "ava_statorimborso"; // Nome del campo

        // Verifica se il form  in creazione
        var formType = formContext.ui.getFormType();

        if (formType === 1) { // 1 = Create
            hideField(avaCodeField); // Nasconde il campo se il record  in creazione
        } else {
            formContext.getControl(avaCodeField).setVisible(true); // Mostra il campo in tutti gli altri stati
            disableField(avaCodeField); // Rende il campo non modificabile
        }
    };
};
